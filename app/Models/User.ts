import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Address from './Address'
import UserPhoto from './UserPhoto'
import ApiToken from './ApiToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public is_worker: boolean

  @column({ serializeAs: null })
  public password: string

  @column()
  public name: string

  @column()
  public phone: number

  @column()
  public rememberMeToken?: string

  @column()
  public is_admin: boolean

  @column()
  public notification_token?: string

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

  @hasOne(() => UserPhoto, { foreignKey: 'user_id' })
  public userPhoto: HasOne<typeof UserPhoto>

  @hasOne(() => Address, { foreignKey: 'user_id'} )
  public address: HasOne<typeof Address>

  @hasMany(() => ApiToken, { foreignKey: 'userId'})
  public tokens: HasMany<typeof ApiToken>

}
