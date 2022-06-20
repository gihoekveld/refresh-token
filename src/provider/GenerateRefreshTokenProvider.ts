import dayjs from "dayjs"
import { client } from "../useCases/prisma/client"

class GenerateRefreshTokenProvider {
    async execute(userId: string) {
        const expireIn = dayjs().add(15, "second").unix()

        const generateRefreshTokenProvider = await client.refreshToken.create({
            data: {
                userId,
                expireIn,
            }
        })

        return generateRefreshTokenProvider
    }
}

export { GenerateRefreshTokenProvider }