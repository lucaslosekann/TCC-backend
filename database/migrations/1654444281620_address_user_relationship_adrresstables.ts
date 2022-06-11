import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddressUserRelationshipAddressTable extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id');
    })
  }
}
