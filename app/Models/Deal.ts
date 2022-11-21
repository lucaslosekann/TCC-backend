import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Rating from './Rating'
import Worker from './Worker'
import Consumer from './Consumer'
import User from './User'
import Service from './Service'

export default class Deal extends BaseModel {
  public serializeExtras = true
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public worker_id: number

  @column()
  public consumer_id: number

  @column()
  public service_id: number

  @column()
  public offer_id: number
  
  @column()
  public status: 'active' | 'closed' | 'cancelled'

  @column()
  public cancelement_reason?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'consumer_id'})
  public consumer: BelongsTo<typeof User>

  @belongsTo(() => Worker, { foreignKey: 'worker_id'})
  public worker: BelongsTo<typeof Worker>

  @belongsTo(() => Service, { foreignKey: 'service_id'})
  public service: BelongsTo<typeof Service>

  @hasMany(() => Rating, {foreignKey: 'deal_id'})
  public ratings: HasMany<typeof Rating>
}
