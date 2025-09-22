import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './tax-calculator-form.module.css'

const INITIAL_FORM_DATA = {
  income: undefined,
  taxYear: '2022',
}

interface FormData {
  income?: number
  taxYear: string
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>

export default function TaxCalculatorForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)

  const incomeId = useId()
  const taxYearId = useId()

  const handleInputChange = (field: keyof FormData) => {
    return (e: InputChangeEvent) => {
      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: e.target.value,
      }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // todo: calculate taxes. Custom hook? New Component?
  }

  return (
    <form className={styles['tax-form']} onSubmit={handleSubmit}>
      <div>
        <label htmlFor={incomeId}>Annual Income</label>
        <div className={styles['income-input-currency']}>
          <input
            id={incomeId}
            type="number"
            max={999_999_999} // See an accountant ;)
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
      </div>
      <button type="submit">Calculate Tax</button>
    </form>
  )
}
