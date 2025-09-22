import type { TaxBracket } from '../../types/taxes'

import { calculateTaxes } from './calculate-taxes'

const mockTaxBrackets: TaxBracket[] = [
  { min: 0, max: 50000, rate: 0.15 },
  { min: 50000, max: 100000, rate: 0.205 },
  { min: 100000, rate: 0.26 },
]

describe('calculateTaxes', () => {
  it('calculates tax for income in first bracket only', () => {
    const result = calculateTaxes(30000, mockTaxBrackets)

    expect(result.totalTax).toBe(4500) // 30000 * 0.15
    expect(result.effectiveRate).toBe(0.15)
    expect(result.taxesByBracket[0].taxAmount).toBe(4500)
    expect(result.taxesByBracket[1].taxAmount).toBe(0)
  })

  it('calculates tax across multiple brackets', () => {
    const result = calculateTaxes(100000, mockTaxBrackets)

    expect(result.totalTax).toBe(17750) // (50000 * 0.15) + (50000 * 0.205)
    expect(result.effectiveRate).toBe(0.178) // 17750 / 100000
    expect(result.taxesByBracket[1].taxAmount).toBe(10250)
    expect(result.taxesByBracket[2].taxAmount).toBe(0)
  })

  it('calculates tax for a very large salary', () => {
    const result = calculateTaxes(1234567, mockTaxBrackets)

    expect(result.totalTax).toBe(312737.42) // (50000 * 0.15) + (50000 * 0.205) + (1134567 * .26)
    expect(result.effectiveRate).toBe(0.253) // 312737.42 / 1234567
    expect(result.taxesByBracket[1].taxAmount).toBe(10250)
    expect(result.taxesByBracket[2].taxAmount).toBe(294987.42)
  })

  it('handles exact bracket boundary', () => {
    const result = calculateTaxes(50000, mockTaxBrackets)

    expect(result.taxesByBracket[0].taxAmount).toBe(7500) // 50000 * 0.15
    expect(result.taxesByBracket[1].taxAmount).toBe(0)
  })

  it('handles zero income', () => {
    const result = calculateTaxes(0, mockTaxBrackets)

    expect(result.totalTax).toBe(0)
    expect(result.effectiveRate).toBe(0)
    expect(result.taxesByBracket.every(item => item.taxAmount === 0)).toBe(true)
  })
})
