import { useState } from 'react'

import styles from './App.module.css'
import type { TaxCalculation } from './types/taxes'
import { TaxCalculatorForm } from './components/tax-calculator/tax-calculator-form'
import { TaxDisplay } from './components/tax-display/tax-display'

export const App = () => {
  const [taxCalculation, setTaxCalculation] = useState<null | TaxCalculation>(
    null
  )

  return (
    <div className={styles.app}>
      <header className={styles['app-header']}>
        <h1>Tax Calculator</h1>
        <p>Calculate your Canadian income tax for any supported year</p>
      </header>
      <main>
        <TaxCalculatorForm onTaxCalculation={setTaxCalculation} />
        <TaxDisplay calculation={taxCalculation} />
      </main>
    </div>
  )
}
