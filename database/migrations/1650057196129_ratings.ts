import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ratings extends BaseSchema {
  protected tableName = 'ratings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('rating').notNullable()
      table.string('comment',255)
      table.integer('deal_id').unsigned().references('id').inTable('deals').onDelete('CASCADE')
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
