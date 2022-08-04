import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Service from './Service'

export default class ServicePhoto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public service_id: number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => File, { foreignKey: 'file_id' })
  public file: HasOne<typeof File>

  @belongsTo(() => Service, { foreignKey: 'service_id' })
  public service: BelongsTo<typeof Service>
}
