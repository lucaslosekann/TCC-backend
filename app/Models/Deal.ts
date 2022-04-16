import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Rating from './Rating'

export default class Deal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public price: number

  @column.dateTime({ columnName: 'agreement_date' })
  public agreementDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'worker_id' })
  public worker: BelongsTo<typeof User>

  @hasMany(() => Rating)
  public ratings: HasMany<typeof Rating>
}
