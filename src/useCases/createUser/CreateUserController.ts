import { Request, Response } from "express"
import { CreateUserCase } from "./CreateUserCase"

class CreateUserController {
    
    async handle(request: Request, response: Response) {
        const { username, password, name } = request.body

        const createUserUseCase = new CreateUserCase()

        const user = await createUserUseCase.execute({
            username,
            name,
            password
        })

        return response.json(user)

    }

}

export { CreateUserController }