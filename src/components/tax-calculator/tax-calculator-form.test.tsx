import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { TaxCalculatorForm } from './tax-calculator-form'

// Mock the API service
vi.mock('../../services/api', () => ({
  fetchTaxBrackets: vi.fn(() =>
    Promise.resolve({
      tax_brackets: [
        { min: 0, max: 50000, rate: 0.15 },
        { min: 50000, rate: 0.25 },
      ],
    })
  ),
}))

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

// There's LOTS more tests that can go here, this is just a basic starting point
describe('TaxCalculatorForm', () => {
  const mockOnTaxCalculation = vi.fn()

  it('disables submit button when required fields are empty', () => {
    renderWithQueryClient(
      <TaxCalculatorForm onTaxCalculation={mockOnTaxCalculation} />
    )

    const submitButton = screen.getByRole('button', { name: 'Calculate Tax' })
    expect(submitButton).toBeDisabled()
  })
})
