import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('price').notNullable()
    })
  }
}
