import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Occupation from './Occupation'
import ServicePhoto from './ServicePhoto'
import Worker from './Worker'
import Deal from './Deal'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public worker_id: number

  @column()
  public active: boolean

  @column()
  public occupation_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Worker, { foreignKey: 'worker_id' })
  public worker: BelongsTo<typeof Worker>

  @belongsTo(() => Occupation, { foreignKey: 'occupation_id' })
  public occupation: BelongsTo<typeof Occupation>

  @hasMany(() => ServicePhoto, {foreignKey: 'service_id'})
  public photos: HasMany<typeof ServicePhoto>

  @hasMany(() => Deal, {foreignKey: 'service_id'})
  public deals: HasMany<typeof Deal>
}
