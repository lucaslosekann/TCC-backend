import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('service_id')
    })
  }
}
