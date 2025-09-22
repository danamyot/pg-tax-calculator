import { render, screen } from '@testing-library/react'

import type { TaxCalculation } from '../../types/taxes'

import { TaxDisplay } from './tax-display'

const mockCalculation: TaxCalculation = {
  totalTax: 15000,
  effectiveRate: 0.15,
  taxesByBracket: [
    {
      bracket: { min: 0, max: 50000, rate: 0.15 },
      taxAmount: 7500,
    },
    {
      bracket: { min: 50000, max: 100000, rate: 0.25 },
      taxAmount: 7500,
    },
  ],
}

describe('TaxDisplay', () => {
  it('displays total tax and effective rate', () => {
    render(<TaxDisplay calculation={mockCalculation} />)

    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.getByText('$15,000')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
  })

  it('filters out tax brackets that dont apply', () => {
    const mockCalculationWithUnusedBracket = {
      ...mockCalculation,
      taxesByBracket: [
        ...mockCalculation.taxesByBracket,
        {
          bracket: { min: 100000, rate: 0.33 },
          taxAmount: 0,
        },
      ],
    }

    render(<TaxDisplay calculation={mockCalculationWithUnusedBracket} />)

    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.queryByText('33%')).not.toBeInTheDocument()
  })

  it('shows empty state when no calculation provided', () => {
    render(<TaxDisplay calculation={null} />)

    expect(
      screen.getByText('Enter your information to display results.')
    ).toBeInTheDocument()
  })
})
