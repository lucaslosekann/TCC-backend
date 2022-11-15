import { schema, rules } from '@ioc:Adonis/Core/Validator'
const OccupationSchema = schema.create({
  occupation_name: schema.string({}, [
    rules.unique({ table: 'occupations', column: 'name' }),
    rules.maxLength(50),
    rules.minLength(3),
  ]),
  photo: schema.file.optional({
    size:'1mb'
  })
})
export const OccupationSchemaEdit = schema.create({
  occupation_name: schema.string({}, [
    rules.maxLength(50),
    rules.minLength(3),
  ]),
  photo: schema.file.optional({
    size:'1mb'
  }),
  id: schema.number(),
  nochange: schema.boolean.optional()
})
export default OccupationSchema
