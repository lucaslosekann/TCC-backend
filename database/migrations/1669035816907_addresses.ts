import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('radius').defaultTo(10).notNullable()
      table.boolean('radius_unlimited').defaultTo(false).notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('radius');
      table.dropColumn('radius_unlimited');
    })
  }
}
