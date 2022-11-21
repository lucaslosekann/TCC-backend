import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ratings extends BaseSchema {
  protected tableName = 'ratings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('price').notNullable().defaultTo(3);
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
    })
  }
}
