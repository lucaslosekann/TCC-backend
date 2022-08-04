import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddNotificationTokenColumn extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('notification_token', 255).unique().nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('notification_token');
    })
  }
}

