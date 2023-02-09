import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Occupation from 'App/Models/Occupation';
import Drive from '@ioc:Adonis/Core/Drive'
import Suggestion from 'App/Models/Suggestion';
import User from 'App/Models/User';

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
      const admins = await User.query().select('*').where('is_admin', true).exec()
      const erro = session.flashMessages.get('error');
      const adm_error = session.flashMessages.get('adm_error');
      let editing; 
      if(request.qs().id){
        editing = await Occupation.query().preload('occupationPhoto').select('*').where('id', request.qs().id).firstOrFail();
        editing = editing.toJSON() 
        if(editing.occupationPhoto){
          let path = await Drive.getSignedUrl(editing.occupationPhoto.path)
          editing.occupationPhoto.path = path
        }
      }
      const suggestions = await Suggestion.all();
      return view.render('admin', {
        user: auth?.user,
        occupations: occ,
        erro,
        admins,
        adm_error,
        suggestions,
        editing
      });
    } catch (e) {
      response.redirect('/');
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({request, session, response}: HttpContextContract) {
    const email = request.input('email');
    try {
      const user = await User.findByOrFail('email', email);
      user.is_admin = true;
      await user.save()
      response.redirect('/');
    } catch (error) {
      session.flash('adm_error', 'Usuario não existente')
      response.redirect('/');
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({request, session, response, auth}: HttpContextContract) {
    try {
      const adm = await User.findOrFail(request.params().id);
      if (auth?.user?.id != 1) {
        session.flash('adm_error', 'Apenas o usuário com id 1 pode deletar outros administradores')
        return response.redirect('/');
      }
      if(auth?.user?.id == adm.id){
        session.flash('adm_error', 'Não pode remover você mesmo')
        return response.redirect('/');    
      }
      adm.is_admin = false;
      await adm.save();
      return response.redirect('/');
    } catch (e) {
      session.flash('error', 'Erro')
      console.log(e)
      return response.redirect('/');
    }
  }
}
