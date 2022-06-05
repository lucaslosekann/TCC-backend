import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Occupation from './Occupation'
import ServicePhoto from './ServicePhoto'
import Worker from './Worker'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'suggested_price'})
  public suggestedPrice: number

  @column()
  public worker_id: number

  @column()
  public occupation_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Worker)
  public worker: BelongsTo<typeof Worker>

  @belongsTo(() => Occupation, { foreignKey: 'occupation_id' })
  public occupation: BelongsTo<typeof Occupation>

  @hasMany(() => ServicePhoto)
  public photos: HasMany<typeof ServicePhoto>
}
