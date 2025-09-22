import TaxCalculatorForm from './components//tax-calculator/tax-calculator-form'

import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles['app-header']}>
        <h1>Tax Calculator</h1>
        <p>Calculate your Canadian income tax for any supported year</p>
      </header>
      <main>
        <TaxCalculatorForm />
      </main>
    </div>
  )
}

export default App
