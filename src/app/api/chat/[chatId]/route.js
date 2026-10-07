import { prisma } from "@/utils/prisma-client";
import { res } from "@/utils/route-handler-response";


export async function GET(req, { params }) {
    const { chatId } = await params;

    const checkConversation = await prisma.conversation.findFirst({
        where: {
            id: parseInt(chatId)
        },
        include: {
            messages: true
        }
    })

    if (checkConversation) {
        return res.json(checkConversation)
    } else {
        return res.json({ error: "CONVERSATION_NOT_FOUND", message: "گفتگویی یافت نشد!" }, { status: 404 })
    }
}


export async function DELETE(req,{params}){
    const { chatId } = await params;

    const deleteConversation = await prisma.conversation.delete({
        where:{
            id:parseInt(chatId)
        }
    })

    return res.json(deleteConversation)
}