import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'zip_code'})
  public zipCode: string

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public complement: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {foreignKey: 'user_id'})
  public user: BelongsTo<typeof User>
}
