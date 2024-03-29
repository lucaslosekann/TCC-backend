import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Rating from 'App/Models/Rating'
import RatingsSchema from 'App/Schemas/Ratings';

export default class RatingsController {
  public async index({}: HttpContextContract) {
    const ratings = await Rating.all();
    return ratings;
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate({
      schema: RatingsSchema
    });
    const newSchema = await Rating.create(payload);
    return newSchema;
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async avarageRating({ request }: HttpContextContract) {
    let query = `SELECT AVG(ratings.rating) FROM deals JOIN ratings ON deals.id = ratings.deal_id WHERE deals.worker_id = ?`
    const avarage = await Database.rawQuery(query, [request.params().worker_id]) 

    query = `SELECT AVG(ratings.price) FROM deals JOIN ratings ON deals.id = ratings.deal_id WHERE deals.worker_id = ?`
    const price = await Database.rawQuery(query, [request.params().worker_id]) 

    query = `SELECT ratings.id, ratings.created_at as date, comment, rating, users.name as from FROM deals JOIN ratings ON deals.id = ratings.deal_id JOIN users on deals.consumer_id = users.id WHERE deals.worker_id = ?`
    const comments = await Database.rawQuery(query, [request.params().worker_id]) 

    return {
      avg: avarage.rows[0].avg ?? 0,
      price: price.rows[0].avg ?? 0,
      comments: comments.rows ?? []
    }
  }
}