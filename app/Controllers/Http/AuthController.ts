import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserSchema from "App/Schemas/User";

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "30 days",
    });
    return token.toJSON();
  }
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: UserSchema
      })
      const newUser = new User();
      newUser.merge(payload)
      await newUser.save();
      const token = await auth.use("api").login(newUser, {
        expiresIn: "30 days",
      });
      return token.toJSON();
    } catch (error) {
      console.log(error);
      response.badRequest(error.messages)
    }
  }
}
