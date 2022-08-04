import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Rating from './Rating'
import Worker from './Worker'
import Consumer from './Consumer'

export default class Deal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public price: number

  @column()
  public worker_id: number

  @column.dateTime({ columnName: 'agreement_date' })
  public agreementDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Consumer)
  public consumer: BelongsTo<typeof Consumer>

  @belongsTo(() => Worker)
  public worker: BelongsTo<typeof Worker>

  @hasMany(() => Rating)
  public ratings: HasMany<typeof Rating>
}
