import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Suggestion extends BaseModel {
  public static table = 'sugestions'

  @column({ isPrimary: true })
  public id: number

  @column()
  public suggestion_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
