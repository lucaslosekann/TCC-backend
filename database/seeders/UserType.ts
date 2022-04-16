import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserType from 'App/Models/UserType'

export default class UserTypeSeeder extends BaseSeeder {
  public async run () {
    await UserType.createMany([
      {
        name: 'worker',
      },
      {
        name: 'user',
      }
    ])
  }
}
