import { schema, rules } from '@ioc:Adonis/Core/Validator'
const AddressStoreSchema = schema.create({
  zipCode: schema.string({}, [
    rules.maxLength(9)
  ]),
  street: schema.string({}, [
    rules.maxLength(100)
  ]),
  number: schema.string({}, [
    rules.maxLength(5)
  ]),
  complement: schema.string.optional({}, [
    rules.maxLength(20)
  ]),
  city: schema.string({}, [
    rules.maxLength(50)
  ]),
  state: schema.string({}, [
    rules.maxLength(50)
  ])
})
const AddressUpdateSchema = schema.create({
  zipCode: schema.string.optional({}, [
    rules.maxLength(9)
  ]),
  street: schema.string.optional({}, [
    rules.maxLength(100)
  ]),
  number: schema.string.optional({}, [
    rules.maxLength(5)
  ]),
  complement: schema.string.optional({}, [
    rules.maxLength(20)
  ]),
  city: schema.string.optional({}, [
    rules.maxLength(50)
  ]),
  state: schema.string.optional({}, [
    rules.maxLength(50)
  ])
})
export  {AddressStoreSchema, AddressUpdateSchema}