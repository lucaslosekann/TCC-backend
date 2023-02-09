import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User';

export default class Address extends BaseModel {
  public serializeExtras = true
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public label?: string

  @column()
  public lat: number

  @column()
  public lon: number

  @column()
  public radius: number

  @column()
  public radius_unlimited: boolean

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {foreignKey: 'user_id'})
  public user: BelongsTo<typeof User>
}
