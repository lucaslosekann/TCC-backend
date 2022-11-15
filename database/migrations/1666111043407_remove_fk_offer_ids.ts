import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('offer_id')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('offer_id')
    })
  }
}
