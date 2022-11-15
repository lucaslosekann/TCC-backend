import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('price').notNullable()
      table.enum('type', ['offer', 'counter-offer']).defaultTo('offer').notNullable()
      table.integer('offer_id').unsigned().references('id').inTable('offers').onDelete('CASCADE')
      
      table.integer('consumer_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('worker_id').unsigned().references('id').inTable('workers').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
