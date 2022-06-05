import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Deal from './Deal'

export default class Consumer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'user_id'})
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Deal)
  public userDeals: HasMany<typeof Deal>
}
