import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import User from './User'

export default class UserPhoto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public file_id: number

  @column({columnName: 'signedUrl'})
  public signedUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => File, { foreignKey: 'id', localKey: 'file_id'})
  public file: HasOne<typeof File>

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>
}
