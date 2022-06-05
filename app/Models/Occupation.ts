import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Service from './Service'

export default class Occupation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => File, {foreignKey: 'occupation_photo'})
  public occupationPhoto: HasOne<typeof File>

  @hasMany(() => Service, {foreignKey: 'occupation_id'})
  public services: HasMany<typeof Service>
}
