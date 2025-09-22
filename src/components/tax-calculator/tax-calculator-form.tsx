import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react'
import { useQuery } from '@tanstack/react-query'

import type { TaxCalculation, TaxYear } from '../../types/taxes'
import styles from './tax-calculator-form.module.css'
import { fetchTaxBrackets } from '../../services/api'

import { calculateTaxes } from './calculate-taxes'

interface FormData {
  taxYear: TaxYear | ''
  income: number | ''
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>

const INITIAL_FORM_DATA: FormData = {
  taxYear: '',
  income: '',
}

export const TaxCalculatorForm = ({
  onTaxCalculation,
}: {
  onTaxCalculation: Dispatch<SetStateAction<TaxCalculation | null>>
}) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)

  const taxYearId = useId()
  const incomeId = useId()

  // Fetch tax brackets for the selected year
  const { data, isLoading: isFetchingBrackets } = useQuery({
    queryKey: ['taxBrackets', formData.taxYear],
    // Casting type as query will be disabled when there's no year
    queryFn: () => fetchTaxBrackets(formData.taxYear as TaxYear),
    enabled: formData.taxYear !== '',
  })
  const { tax_brackets: taxBrackets } = data ?? {}

  const handleInputChange = useCallback((field: keyof FormData) => {
    return (e: InputChangeEvent) => {
      let value: string | number = e.target.value

      // Convert income to number for math later on, but keep empty string as is
      if (field === 'income' && value !== '') {
        value = Number(e.target.value)
      }

      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: value,
      }))
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Valid income and brackets are required to submit, but TS doesn't know that
    if (
      typeof formData.income === 'number' &&
      formData.income > 0 &&
      taxBrackets
    ) {
      const calculatedTaxes = calculateTaxes(formData.income, taxBrackets)
      onTaxCalculation(calculatedTaxes)
    }
  }

  const canSubmit =
    formData.income && formData.income > 0 && taxBrackets && !isFetchingBrackets

  return (
    <form className={styles['tax-form']} onSubmit={handleSubmit}>
      <h2>Tax Information</h2>
      <div>
        <label className={styles['tax-form__label']} htmlFor={taxYearId}>
          Tax Year
        </label>
        <select
          required
          id={taxYearId}
          value={formData.taxYear}
          onChange={handleInputChange('taxYear')}
        >
          <option value="" disabled>
            Select a year
          </option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          {/* enable me to test 404 errors! */}
          <option value="2024" disabled>
            2024
          </option>
        </select>
        {isFetchingBrackets && (
          <p className={styles['loading-message']}>Loading tax brackets...</p>
        )}
      </div>
      <div>
        <label className={styles['tax-form__label']} htmlFor={incomeId}>
          Annual Income
        </label>
        <div className={styles['income-input__currency-icon']}>
          <input
            required
            id={incomeId}
            type="number"
            min={1}
            max={999_999_999} // Don't use this app, see an accountant ;)
            value={formData.income}
            onChange={handleInputChange('income')}
          />
        </div>
      </div>
      <button type="submit" disabled={!canSubmit}>
        Calculate Tax
      </button>
    </form>
  )
}
