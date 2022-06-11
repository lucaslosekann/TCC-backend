import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddressUserRelationship extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('address_id');
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('address_id').unsigned().references('id').inTable('addresses')
    })
  }
}
