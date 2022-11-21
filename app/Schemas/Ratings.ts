import { schema, rules } from '@ioc:Adonis/Core/Validator'
const RatingsSchema = schema.create({
  rating: schema.number(),
  price: schema.number(),
  comment: schema.string.optional([
      rules.maxLength(255)
  ]),
  deal_id: schema.number()
})
export default RatingsSchema
