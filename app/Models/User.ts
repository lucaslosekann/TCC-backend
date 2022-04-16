import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Address from './Address'
import Deal from './Deal'
import Service from './Service'
import UserType from './UserType'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => File, { foreignKey: 'user_photo' })
  public userPhoto: HasOne<typeof File>

  @hasOne(() => Address)
  public address: HasOne<typeof Address>

  @hasOne(() => UserType)
  public userType: HasOne<typeof UserType>

  @hasMany(() => Deal, { foreignKey: 'user_id' })
  public userDeals: HasMany<typeof Deal>

  @hasMany(() => Deal, { foreignKey: 'worker_id' })
  public workerDeals: HasMany<typeof Deal>

  @hasMany(() => Service, { foreignKey: 'worker_id' })
  public workerServices: HasMany<typeof Service>

}
