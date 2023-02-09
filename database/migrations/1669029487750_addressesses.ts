import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('zip_code');
      table.dropColumn('street');
      table.dropColumn('number');
      table.dropColumn('complement');
      table.dropColumn('city');
      table.dropColumn('state');
      table.float('lat', 53);
      table.float('lon', 53);
      table.string('label');
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('zip_code').notNullable()
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('complement')
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.dropColumn('lat');
      table.dropColumn('lon');
      table.dropColumn('label');
    })
  }
}
