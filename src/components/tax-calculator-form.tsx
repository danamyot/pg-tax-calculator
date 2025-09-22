import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import type { TaxYear } from '../types/taxes'
import styles from './tax-calculator-form.module.css'
import { fetchTaxBrackets } from '../services/api'
import { useQuery } from '@tanstack/react-query'
interface FormData {
  income?: number
  taxYear: TaxYear
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>

const INITIAL_FORM_DATA: FormData = {
  income: undefined,
  taxYear: '2022',
}

export default function TaxCalculatorForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)

  const incomeId = useId()
  const taxYearId = useId()

  // Fetch tax brackets for the selected year
  const { data: taxBrackets, isLoading: isFetchingBrackets } = useQuery({
    queryKey: ['taxBrackets', formData.taxYear],
    queryFn: () => fetchTaxBrackets(formData.taxYear),
  })

  const handleInputChange = (field: keyof FormData) => {
    return (e: InputChangeEvent) => {
      // Convert income to number for math later on
      const value = field === 'income' ? Number(e.target.value) : e.target.value

      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: value,
      }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // todo: calculate taxes. Custom hook? New Component?
  }

  const canSubmit =
    formData.income && formData.income > 0 && taxBrackets && !isFetchingBrackets

  return (
    <form className={styles['tax-form']} onSubmit={handleSubmit}>
      <div>
        <label htmlFor={incomeId}>Annual Income</label>
        <div className={styles['income-input-currency']}>
          <input
            id={incomeId}
            type="number"
            min={0}
            max={999_999_999} // Don't use this app, see an accountant ;)
            value={formData.income}
            onChange={handleInputChange('income')}
          />
        </div>
      </div>
      <div>
        <label htmlFor={taxYearId}>Tax Year</label>
        <select
          id={taxYearId}
          value={formData.taxYear}
          onChange={handleInputChange('taxYear')}
        >
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2024" disabled>
            2024
          </option>
        </select>
        {isFetchingBrackets && <p>Loading tax brackets...</p>}
      </div>

      <button type="submit" disabled={!canSubmit}>
        Calculate Tax
      </button>
    </form>
  )
}
