import { schema, rules } from '@ioc:Adonis/Core/Validator'
const DealSchema = schema.create({
  offer_id: schema.number()
})
export const FinishDealSchema = schema.create({
  deal_id: schema.number(),
  rating: schema.number([
    rules.range(1, 5)
  ]),
  comment: schema.string.optional([
    rules.maxLength(200)
  ])
})
export const CancelDealSchema = schema.create({
  deal_id: schema.number(),
  reason: schema.string([
    rules.maxLength(255)
  ])
})
export default DealSchema
