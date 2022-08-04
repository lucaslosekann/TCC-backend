import { schema, rules } from '@ioc:Adonis/Core/Validator'
const NotificationTokenSchema = schema.create({
  token: schema.string([
      rules.maxLength(255)
  ]),
})
export default NotificationTokenSchema
