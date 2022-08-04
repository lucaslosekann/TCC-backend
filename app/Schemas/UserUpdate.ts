import { rules, schema } from "@ioc:Adonis/Core/Validator"

const UserUpdateSchema = schema.create({
  photo: schema.file.optional({
    size:'2mb',
    extnames: ['png','jpg']
  }),
  phone: schema.number.optional([
    rules.unique({ table: 'users', column: 'phone' }),
  ]),
  isWorker: schema.boolean.optional(),
})
export default UserUpdateSchema
