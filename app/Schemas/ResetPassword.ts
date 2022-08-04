import { rules, schema } from "@ioc:Adonis/Core/Validator"

const ResetPassword = schema.create({
  token: schema.string(),
  password: schema.string({}, [
    rules.confirmed('password_confirmation'),
    rules.minLength(6),
  ]),
})
export default ResetPassword
