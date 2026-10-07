

import { OllamaConnector } from "@/utils/ollama-connector"
import { prisma } from "@/utils/prisma-client"
import { res } from "@/utils/route-handler-response"


export async function POST(req) {

    const { conv_id, content, sender } = await req.json()

    const {created_at,content:response} =await OllamaConnector(content)

    // let cleanedResponse = response
    // .replace(/<think>[\s\S]*?<\/think>/g, "")
    // .replace(/\n{2,}/g, "\n")
    // .trim();
    // console.log(created_at,cleanedResponse , "is AIResponse")
    // console.log(response , "is response")
    
    await prisma.conversation.update({
        where: {
            id: conv_id
        },
        data: {
            messages: {
                create: {
                    content,
                    sender
                }
            }
        },
        select: {
            messages: true
        }
    })

    const createBotMessage = await prisma.conversation.update({
        where: {
            id: conv_id
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

    return res.json(createBotMessage)
}

export async function PUT(req) {
    const { conv_id, content, sender, created } = await req.json()

    const updateMessage = await prisma.messages.update({
        where: {
            created_conversation_id: {
                conversation_id: conv_id,
                created
            }
        },
        data: {
            content,
            sender,

        }
    })

    return res.json(updateMessage)
}