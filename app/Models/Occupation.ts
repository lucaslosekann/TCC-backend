import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Service from './Service'

export default class Occupation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public occupation_photo: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => File, {foreignKey: 'occupation_photo'})
  public occupationPhoto: BelongsTo<typeof File>

  @hasMany(() => Service, {foreignKey: 'occupation_id'})
  public services: HasMany<typeof Service>
}
