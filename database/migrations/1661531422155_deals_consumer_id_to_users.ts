import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deals extends BaseSchema {
  protected tableName = 'deals'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('consumer_id')
      table.foreign('consumer_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('consumer_id')
      table.integer('consumer_id').references('id').inTable('users')
    })
  }
}
