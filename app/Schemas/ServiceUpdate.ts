import { schema, rules } from '@ioc:Adonis/Core/Validator'
const ServiceUpdateSchema = schema.create({
  photos: schema.array.optional().members(
    schema.file({
      size:'10mb',
      extnames: ['png','jpg']
    })
  ),
  savedPhotos: schema.array.optional().anyMembers(),
  service: schema.number([
    rules.exists({table: 'services', column: 'id'})
  ])
})
export default ServiceUpdateSchema
