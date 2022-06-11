import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeUserPhotoKeys extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_photo')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_photo').unsigned().references('id').inTable('files')
    })
  }
}
