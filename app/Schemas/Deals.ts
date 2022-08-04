import { schema, rules } from '@ioc:Adonis/Core/Validator'
const DealSchema = schema.create({
  price: schema.number(),
  worker_id: schema.number(),
  agreement_date: schema.date.optional()
})
export default DealSchema
