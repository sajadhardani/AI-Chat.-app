import { SECRET_KEY } from "@/utils/config"
import { prisma } from "@/utils/prisma-client"
import { res } from "@/utils/route-handler-response"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


export async function POST(req) {
    const { username, password } = await (req.json())

    const checkUser = await prisma.user.findFirst({
        where: {
            username
        }
    })

    if (!checkUser) {
        return res.json({ error: "کاربری یافت نشد!" }, { status: 400 })
    }

    console.log(await bcrypt.compare(password,checkUser.password))
    if (await bcrypt.compare(password, checkUser.password)) {
        const token = jwt.sign({ id: checkUser.id, username, name:checkUser.name, email:checkUser.email }, SECRET_KEY, { expiresIn: "14D" });
        const user = {
            id: checkUser.id,
            username,
            name: checkUser.name,
            token
        }
        await prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                tokens:{
                    create:{
                        token,
                        device_id:"device"
                    }
                }
            }
        })
        const cookieStore = await cookies();
        cookieStore.set("token",token)
        return res.json(user)
    }

    return res.json({ error: "رمزعبور اشتباه است!" }, { status: 403 })

}