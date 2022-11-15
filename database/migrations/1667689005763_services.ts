import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('worker_id')
      table.dropForeign('occupation_id')
      table.foreign('worker_id').references('id').inTable('workers').onDelete('CASCADE')
      table.foreign('occupation_id').references('id').inTable('occupations').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('worker_id')
      table.dropForeign('occupation_id')
      table.foreign('worker_id').references('id').inTable('workers')
      table.foreign('occupation_id').references('id').inTable('occupations')
    })
  }
}
