import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('name', 255).notNullable()
      table.string('phone', 20).notNullable().unique()
      table.integer('user_photo').unsigned().references('id').inTable('files')
      table.integer('address_id').unsigned().references('id').inTable('addresses')
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('user_type').unsigned().references('id').inTable('user_types')
      table.string('remember_me_token').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
