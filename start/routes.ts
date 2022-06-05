/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import { Router } from '@adonisjs/core/build/standalone';
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");
  Route.get("occupation", "OccupationsController.index");
  Route.get("occupation/:id", "OccupationsController.show");

  Route.group(() => {
    Route.get("me", "AuthController.me");
    Route.post("logout", "AuthController.logout");
    
    Route.resource("service", "ServicesController")

    Route.group(() => {
      Route.post("occupation", "OccupationsController.store");
      Route.delete("occupation", "OccupationsController.destroy");
      Route.put("occupation", "OccupationsController.update");

    }).prefix("admin").middleware("auth_admin");

  }).middleware("auth:api");

}).prefix("api");
