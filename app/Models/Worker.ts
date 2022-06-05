import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Deal from './Deal'
import Service from './Service'

export default class Worker extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public isSponsored: boolean

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Deal)
  public deals: HasMany<typeof Deal>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>
}
