import { schema, rules } from '@ioc:Adonis/Core/Validator'
const UserSchema = schema.create({
  photo: schema.file.optional({
    size:'2mb',
    extnames: ['png','jpg']
  }),
  email: schema.string({}, [
    rules.email(),
    rules.unique({ table: 'users', column: 'email' }),
  ]),
  password: schema.string({}, [
    rules.confirmed('password_confirmation'),
    rules.minLength(6),
  ]),
  name: schema.string({}, [
    rules.maxLength(50),
    rules.minLength(3),
    rules.notIn(['admin', 'super', 'moderator', 'public', 'dev', 'alpha', 'mail']) // 👈
  ]),
  phone: schema.string({}, [
    rules.unique({ table: 'users', column: 'phone' }),
  ]),
  isWorker: schema.boolean.optional(),
})
export default UserSchema
