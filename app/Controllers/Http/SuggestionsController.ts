import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Suggestion from 'App/Models/Suggestion';
import { SuggestionSchema } from 'App/Schemas/SuggestionsSchema';

export default class SuggestionsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: SuggestionSchema
      });
      const sug = await Suggestion.create(payload);
      return sug;
    } catch (error) {
      switch (error.message) {
        case "E_VALIDATION_FAILURE: Validation Exception":
          response.status(400).json({ error: error?.messages?.errors[0]?.message })
          break;
        default:
          response.status(500).json({ error: "Houve um problema, por favor tente novamente mais tarde" })
      }
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request, response, session }: HttpContextContract) {
    try {
      const suggestion = await Suggestion.findOrFail(request.params().id)
      await suggestion.delete();
      return response.redirect('/');
    } catch (e) { 
      session.flash('error_sug', 'Erro')
      console.log(e)
      return response.redirect('/');
    }
  }
}
