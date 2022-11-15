import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Deal from 'App/Models/Deal';
import Offer from 'App/Models/Offer';
import Rating from 'App/Models/Rating';
import Worker from 'App/Models/Worker';
import DealSchema, { FinishDealSchema } from 'App/Schemas/Deals';

export default class DealsController {
  public async index({auth}: HttpContextContract) {
    const deals = await Database.rawQuery(
      `select o.name as occ, c.name as c_name, wU.name as w_name, s.suggested_price as sug_price, d.*
      from deals d
      inner join services s on s.id = d.service_id 
      inner join occupations o on o.id = s.occupation_id
      inner join workers w on w.id = d.worker_id
      inner join users wU on w.user_id = wU.id
      inner join users c on c.id = d.consumer_id
      where consumer_id = ?
      or w.user_id = ?
      order by d.status ASC, d.created_at DESC`,
      [auth.user?.id as any, auth.user?.id as any]
    )
    return deals.rows;
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, auth, response }: HttpContextContract) {
    try{
      const payload = await request.validate({
        schema: DealSchema
      });
      const dealFromOffer = await Deal.findBy('offer_id', payload.offer_id)
      if(!!dealFromOffer){
        return response.status(400).json({ error: 'Esta oferta já foi aceita!' })
      }
      const offer = await Offer.findOrFail(payload.offer_id);
      if(Math.abs(offer.createdAt.diffNow('hours').values.hours) > 24){
        return response.status(400).json({ error: 'Esta oferta já expirou!' })
      }
      let data = {} as any;
      const userWorker = await Worker.findOrFail(offer.worker_id);
      data.consumer_id = offer.consumer_id;
      data.worker_id = offer.worker_id;
      data.service_id = offer.service_id;
      if(auth?.user?.id != userWorker.userId){
        console.log(auth?.user?.id, data.worker_id)
        return response.status(500).json({ error: 'Erro conhecido' })
      }

      const newDeal = await Deal.create({
        price: offer.price,
        offer_id: offer.id,

        // agreementDate: new Date(Date.now()),
        ...data      
      });
      return newDeal;
    }catch (error) {
      switch (error.message) {
        case "E_VALIDATION_FAILURE: Validation Exception":
          response.status(400).json({ error: error?.messages?.errors[0]?.message })
          break;
        default:
          console.log(error);+
          response.status(500).json({ error: "Houve um problema, por favor tente novamente mais tarde" })
      }
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request, auth, response }: HttpContextContract) {
    try{
      const payload = await request.validate({
        schema: FinishDealSchema
      });
  
      const deal = await Deal.findOrFail(payload.deal_id);
      if(auth?.user?.id != deal.consumer_id){
        return response.status(500).json({ error: 'Erro desconhecido' })
      }
      if(deal.status == 'closed'){
        return response.status(500).json({ error: 'Erro desconhecido' })
      }
      deal.status = 'closed';
      await deal.save()
      const rating = Rating.create({
        comment: payload.comment,
        rating: payload.rating,
        deal_id: payload.deal_id
      })
      return rating
    }catch(e){
      console.log(e)
      return response.status(500).json({ error: 'Erro desconhecido' })
    }
  }
}
