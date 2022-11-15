import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServicePhotos extends BaseSchema {
  protected tableName = 'service_photos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('service_id')
      table.dropForeign('file_id')
      table.foreign('service_id').references('id').inTable('services').onDelete('CASCADE')
      table.foreign('file_id').references('id').inTable('files').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('service_id')
      table.dropForeign('file_id')
      table.foreign('service_id').references('id').inTable('services')
      table.foreign('file_id').references('id').inTable('files')
    })
  }
}
