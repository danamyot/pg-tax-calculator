import type { TaxBracket, TaxCalculation } from '../../types/taxes'

export const calculateTaxes = (
  income: number,
  taxBrackets: TaxBracket[]
): TaxCalculation => {
  const taxesByBracket = taxBrackets.map(bracket => {
    const { max, min, rate } = bracket

    let taxAmount = 0

    // No income applies for this bracket, ignore
    if (income <= min) {
      return { bracket, taxAmount }
    }

    // Take the relevant amount of income and multiply it by the rate
    if (max && income > max) {
      taxAmount = (max - min) * rate
    } else {
      taxAmount = (income - min) * rate
    }

    // Round to 2 decimal places
    return { bracket, taxAmount: Math.round(taxAmount * 100) / 100 }
  })

  const totalTax = taxesByBracket.reduce((total, current) => {
    return total + current.taxAmount
  }, 0)

  const effectiveRate = income > 0 ? totalTax / income : 0

  return {
    taxesByBracket,
    // Same rounding as in tax bracket map above
    totalTax: Math.round(totalTax * 100) / 100,
    // Rate rounded to 3
    effectiveRate: Math.round(effectiveRate * 1000) / 1000,
  }
}
