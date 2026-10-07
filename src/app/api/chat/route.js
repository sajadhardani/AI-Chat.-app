import { OllamaConnector } from "@/utils/ollama-connector";
import { prisma } from "@/utils/prisma-client"
import { res } from "@/utils/route-handler-response"


export async function POST(req) {

    const { user_id, content } = await req.json()

    const {created_at,title , content:response} =await OllamaConnector(content)

    // console.log(response , 'is response')

    const createConversation = await prisma.user.update({
        where: {
            id: user_id
        },
        data: {
            conversations: {
                create: {
                    title,
                    messages: {
                        create: {
                            content
                        }

                    }
                }
            }
        },
        select: {
            conversations: {
                select: {
                    id: true,
                    title: true
                },
                orderBy: {
                    created: 'desc'
                },
            }
        }
    })

    await prisma.conversation.update({
        where: {
            id: createConversation.conversations[0].id
        },
        data: {
            messages: {
                create: {
                    content:response,
                    sender:"BOT",
                    // created:new Date(created_at)
                }
            }
        },
        select: {
            messages: true
        }
    })

    return res.json(createConversation)
}

export async function GET(req) {
    const { searchParams } = req.nextUrl;
    const user_id = searchParams.get("user_id")

    if (!user_id) {
        return res.json({ error: "UNAUTHORIZED" }, { status: 403 })
    }

    const conversations = await prisma.conversation.findMany({
        where: {
            user_id: parseInt(user_id)
        },
        select: {
            id: true,
            title: true
        },
        orderBy: {
            created: "desc"
        }
    })

    return res.json(conversations)
}