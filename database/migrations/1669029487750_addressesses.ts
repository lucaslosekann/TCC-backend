import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addressess extends BaseSchema {
  protected tableName = 'addressess'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
