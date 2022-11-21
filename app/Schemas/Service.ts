import { schema, rules } from '@ioc:Adonis/Core/Validator'
const ServiceSchema = schema.create({
  photos: schema.array.optional().members(
    schema.file({
      size:'10mb',
      extnames: ['png','jpg']
    })
  ),
  worker_occupation: schema.object([
    rules.uniqueCombination({table:'services', column1: 'worker_id', column2: 'occupation_id'})
  ]).members({
    worker_id: schema.number([
      rules.exists({ table: 'workers', column: 'id' }),
    ]),
    occupation_id: schema.number([
      rules.exists({ table: 'occupations', column: 'id' })
    ])
  })
})
export default ServiceSchema
