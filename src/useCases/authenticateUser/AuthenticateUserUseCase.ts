import { compare } from "bcryptjs"

import { client } from "../prisma/client";
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";


interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {

  async execute({username, password}: IRequest) {
    // Verify if user already exists
    const userAlreadyExists = await client.user.findFirst({
      where: {
        username
      }
    });

    if(!userAlreadyExists) {
      throw new Error("User or password incorrect!");
    }

    // Verify if password is correct
    const passwordMatch = await compare(password, userAlreadyExists.password);

    if(!passwordMatch) {
      throw new Error("User or password incorrect!");
    }

    // Generate token of the user
    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(userAlreadyExists.id);

    await client.refreshToken.deleteMany({
      where: {
        userId: userAlreadyExists.id
      }
    })

    const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
    const refreshToken = await generateRefreshTokenProvider.execute(
      userAlreadyExists.id
    );

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase }