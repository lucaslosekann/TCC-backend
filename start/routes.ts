

import Route from '@ioc:Adonis/Core/Route'

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
  Route.get("file", "FilesController.show")
  Route.get("service/:id", "ServicesController.show")
  Route.post("ratings", "RatingsController.store")
  Route.post("deals", "DealsController.store")
  Route.get("avaragerating/:worker_id", "RatingsController.avarageRating")
  
  Route.group(() => {
    Route.get("me", "UsersController.show");
    Route.post("logout", "AuthController.logout");
    Route.put("updateNotificationToken", "UsersController.updateNotificationToken")
    // Route.resource("service", "ServicesController");

    Route.post("address", "AddressesController.store");
    Route.get("address/:id", "AddressesController.show");
    Route.put("address", "AddressesController.update");
    Route.delete("address", "AddressesController.destroy");
    Route.put("me", "UsersController.update");
    
    Route.group(() => {
      Route.post("occupation", "OccupationsController.store");
      Route.delete("occupation", "OccupationsController.destroy");
      Route.put("occupation", "OccupationsController.update");

    }).prefix("admin").middleware("auth_admin");

  }).middleware("auth:api");

}).prefix("api").middleware('anti_spam');
