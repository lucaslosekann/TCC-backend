import { rules, schema } from "@ioc:Adonis/Core/Validator";

export const SuggestionSchema = schema.create({
  suggestion_name: schema.string({}, [
    rules.unique({ table: 'occupations', column: 'name' }),
    rules.unique({ table: 'sugestions', column: 'suggestion_name' }),
    rules.maxLength(50),
    rules.minLength(3),
  ])
})