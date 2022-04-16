import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deals extends BaseSchema {
  protected tableName = 'deals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('price').notNullable()
      table.timestamp('agreement_date', { useTz: true })
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('worker_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
