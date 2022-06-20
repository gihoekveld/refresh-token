import { hash } from "bcryptjs";
import { client } from "../../prisma/client";

interface IUserRequest {
    name: string;
    password: string;
    username: string;
}


class CreateUserCase {
    async execute({ name, password, username } : IUserRequest) {
        // Verificar se o usuario existe
        const userAlreadyExists = await client.user.findFirst({
            where: {
                username
            }
        })
        

        if(userAlreadyExists) {
            throw new Error("User already exists")
        }

        // Cadastra o usuario

        const passwordHash = await hash(password, 8);

        const user = await client.user.create({
            data: {
                name,
                username,
                password: passwordHash
            }
        })

        return user
    }
}

export { CreateUserCase }