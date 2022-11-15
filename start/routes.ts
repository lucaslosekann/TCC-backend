

import Route from '@ioc:Adonis/Core/Route'

Route.get('login', "LoginController.index");
Route.post('login', "LoginController.store");
Route.group(()=>{
  Route.get('logout', 'LoginController.destroy');
  Route.get('/', 'AdminsController.index');
  Route.post("occupation", "OccupationsController.store");
  Route.get("del_occupation", "OccupationsController.destroy");
  Route.get("p", "FilesController.key");
  Route.post("edit_occupation", "OccupationsController.update");
}).middleware('auth:web').middleware("web_admin");
Route.get("file", "FilesController.show")
Route.group(() => {
  Route.get('logs', 'LogsController.index')
  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");


  Route.group(()=>{
    Route.post("reset_password", "ResetPasswordController.store")
    Route.post("forgot_password", "ForgotPasswordController.store")
  }).middleware('log')
  Route.get("occupation", "OccupationsController.index");
  Route.get("occupation/:id", "OccupationsController.show");
  Route.get("occupation/name/:id", "OccupationsController.showByid");
  Route.get("service/:id", "ServicesController.show")
  Route.post("ratings", "RatingsController.store")
  Route.post("deals", "DealsController.store")
  Route.get("avaragerating/:worker_id", "RatingsController.avarageRating")
  
  Route.group(() => {
    Route.get("me", "UsersController.show");
    Route.post("logout", "AuthController.logout");
    Route.put("updateNotificationToken", "UsersController.updateNotificationToken")
    Route.post("changePassword", "AuthController.changePassword");
    Route.post("changePhoto", "AuthController.changePhoto");

    Route.post("service", "ServicesController.store");
    Route.get("service", "ServicesController.index");
    Route.get("service/worker/:id", "ServicesController.worker");
    Route.post("service_toggle", "ServicesController.toggle");
    Route.put("service", "ServicesController.update");

    Route.post("deal", "DealsController.store");
    Route.get("deal", "DealsController.index");
    Route.post("finishDeal", "DealsController.destroy");

    Route.get("userChat/:id", "UsersController.getChatInfoByUser");

    Route.post("address", "AddressesController.store");
    Route.get("address/:id", "AddressesController.show");
    Route.put("address", "AddressesController.update");
    Route.delete("address", "AddressesController.destroy");
    Route.put("me", "UsersController.update");
    
    Route.group(() => {

    }).prefix("admin").middleware("auth_admin");

  }).middleware("auth:api");

}).prefix("api").middleware('anti_spam');
