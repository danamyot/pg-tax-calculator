export interface TaxBracket {
  min: number
  max?: number
  rate: number
}

export interface TaxBracketsResponse {
  tax_brackets: TaxBracket[]
}

export type TaxYear = '2019' | '2020' | '2021' | '2022'
