import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('suggested_price');
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('suggested_price')
    })
  }
}
