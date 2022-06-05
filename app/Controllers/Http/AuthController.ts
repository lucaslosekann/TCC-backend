import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Consumer from "App/Models/Consumer";
import User from "App/Models/User";
import Worker from "App/Models/Worker";
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
      const isWorker = payload.isWorker;
      delete payload.isWorker;
      const newUser = await User.create(payload);
      if(isWorker){
        await Worker.create({
          userId: newUser.id
        });
      }else{
        await Consumer.create({
          userId: newUser.id
        })
      }

      const token = await auth.use("api").login(newUser, {
        expiresIn: "30 days",
      });
      return token.toJSON();
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
