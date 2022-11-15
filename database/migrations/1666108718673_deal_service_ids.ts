import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deals extends BaseSchema {
  protected tableName = 'deals'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('service_id');
    })
  }
}
