import { useMemo } from 'react'

import type { TaxCalculation } from '../../types/taxes'

import styles from './tax-display.module.css'

const displayAsPercentage = (number: number) => {
  if (number === 0) {
    return 0 + '%'
  }

  const percentage = number * 100
  const isWholeNum = percentage % 1 === 0

  return percentage.toFixed(isWholeNum ? 0 : 1) + '%'
}

export const TaxDisplay = ({
  calculation,
}: {
  calculation: TaxCalculation | null
}) => {
  const filteredBrackets = useMemo(
    () =>
      calculation?.taxesByBracket.filter(elem => {
        return elem.taxAmount > 0
      }),
    [calculation?.taxesByBracket]
  )

  if (!calculation) {
    return (
      <section className={styles['tax-display']}>
        <h2>Results</h2>
        <p>Enter your information to display results.</p>
      </section>
    )
  }

  return (
    <section className={styles['tax-display']}>
      <h2>Results</h2>
      <div className={styles['tax-display__main-info']}>
        <p>
          Total taxes:{' '}
          <span className={styles['bold-value']}>
            ${calculation?.totalTax.toLocaleString()}
          </span>
        </p>
        <p>
          Effective rate:{' '}
          <span className={styles['bold-value']}>
            {displayAsPercentage(calculation?.effectiveRate ?? 0)}
          </span>
        </p>
      </div>

      {calculation?.taxesByBracket && calculation.taxesByBracket.length > 0 && (
        <div className={styles['tax-display__bracket-table-container']}>
          <h3>Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Tax bracket</th>
                <th>Taxes paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrackets?.map(item => (
                <tr key={`${item.bracket.min}-${item.bracket.max}`}>
                  <td>
                    ${item.bracket.min.toLocaleString()}
                    {
                      item.bracket.max
                        ? ` - $${item.bracket.max.toLocaleString()}`
                        : ' or\u00A0more' // \u00A0 === &nbsp;
                    }
                  </td>
                  <td>${item.taxAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
