declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    uniqueCombination(options: {
      table: string,
      column1: string,
      column2: string
    }): Rule
  }
}
