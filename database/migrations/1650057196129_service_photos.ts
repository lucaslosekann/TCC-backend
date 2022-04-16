import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServicePhotos extends BaseSchema {
  protected tableName = 'service_photos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('service_id').unsigned().references('id').inTable('services')
      table.integer('file_id').unsigned().references('id').inTable('files')
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
