import { string } from '@ioc:Adonis/Core/Helpers'
import { rules, validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

validator.rule('uniqueCombination', async (
  value,
  [{table,
    column1,
    column2}],
  options
) => {
  const res = await Database.from(table).select('id').
    where(column1, value[Object.keys(value)[0]]).
    andWhere(column2, value[Object.keys(value)[1]]).exec()
  if (res.length > 0) {
    options.errorReporter.report(
      options.pointer,
      'uniqueCombination',
      `The combination of ${column1} and ${column2} must be unique!`,
      options.arrayExpressionPointer,
    )
  }
})