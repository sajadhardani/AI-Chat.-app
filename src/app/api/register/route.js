import { prisma } from "@/utils/prisma-client"
import { res } from "@/utils/route-handler-response"


export async function POST(req) {
    const { name, username, email, password } = await (req.json())

    const findUserByEmail = await prisma.user.findFirst({
        where: {
            email
        }
    })
    const findUserByUsername = await prisma.user.findFirst({
        where: {
            username
        }
    })

    if (findUserByEmail) {
        return res.json({ error: "کاربر با پست الکترونیکی وارد شده وجود دارد!" }, { status: 400 })
    }
    if (findUserByUsername) {
        return res.json({ error: "کاربر با نام کاربری وارد شده وجود دارد!" }, { status: 400 })
    }
    const createNewUser = await prisma.user.create({
        data: {
            name,
            email,
            username,
            password,
        }
    })
    // console.log(body , "is body")

    return res.json(createNewUser)
}