import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeUserPhotoKeys extends BaseSchema {
  protected tableName = 'user_photos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('signedUrl', 'longtext')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('signedUrl')
    })
  }
}
