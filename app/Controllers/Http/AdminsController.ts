import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Occupation from 'App/Models/Occupation';
import Drive from '@ioc:Adonis/Core/Drive'

export default class AdminsController {
  public async index({auth, view, session, request, response}: HttpContextContract) {
    try {
      let occ = await Occupation.query().preload('occupationPhoto').select('*').exec(); 
      for (let i in occ) {
        let o = occ[i];
        if(o.occupationPhoto){
          let path = await Drive.getSignedUrl(o.occupationPhoto.path)
          occ[i].occupationPhoto.path = path
        }
      }

      const erro = session.flashMessages.get('error');
      let editing; 
      if(request.qs().id){
        editing = await Occupation.query().preload('occupationPhoto').select('*').where('id', request.qs().id).firstOrFail();
        editing = editing.toJSON() 
        if(editing.occupationPhoto){
          let path = await Drive.getSignedUrl(editing.occupationPhoto.path)
          editing.occupationPhoto.path = path
        }
      }
      return view.render('admin', {
        user: auth?.user,
        occupations: occ,
        erro,
        editing
      });
    } catch (e) {
      response.redirect('/');
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
