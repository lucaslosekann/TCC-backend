import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public receiver_id: number

  @column()
  public sender_name: string

  @column()
  public sender_id: number

  @column()
  public message_type: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
