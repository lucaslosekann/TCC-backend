import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Deal from './Deal'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Deal)
  public deal: BelongsTo<typeof Deal>
}
