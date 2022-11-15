import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DealsStatus extends BaseSchema {
  protected tableName = 'deals'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['active', 'closed']).defaultTo('active')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
