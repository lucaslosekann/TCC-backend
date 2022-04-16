import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Occupation from './Occupation'
import ServicePhoto from './ServicePhoto'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'suggested_price'})
  public suggestedPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'worker_id' })
  public worker: BelongsTo<typeof User>

  @belongsTo(() => Occupation, { foreignKey: 'occupation_id' })
  public occupation: BelongsTo<typeof Occupation>

  @hasMany(() => ServicePhoto)
  public photos: HasMany<typeof ServicePhoto>
}
