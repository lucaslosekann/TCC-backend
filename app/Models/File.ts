import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public size: number

  @column()
  public cloudId: string

  @column()
  public drive: string

  @column()
  public mimeType: string

  @column()
  public path: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
