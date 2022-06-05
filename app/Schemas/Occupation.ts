import { schema, rules } from '@ioc:Adonis/Core/Validator'
const OccupationSchema = schema.create({
  name: schema.string({}, [
    rules.unique({ table: 'occupations', column: 'name' }),
    rules.maxLength(50),
    rules.minLength(3),
  ]),
  photo: schema.file.optional(),
})
export default OccupationSchema
