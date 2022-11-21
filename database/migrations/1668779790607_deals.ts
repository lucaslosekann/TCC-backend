import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deals extends BaseSchema {
  protected tableName = 'deals'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('status').defaultTo('active').alter()
      table.string('cancelement_reason',255)
      table.dropColumn('agreement_date')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('status').alter()
      table.dropColumn('cancelement_reason')
      table.timestamp('agreement_date', { useTz: true })
    })
  }
}
