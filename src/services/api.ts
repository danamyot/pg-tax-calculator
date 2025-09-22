import { config, getApiUrl } from '../config'
import type { TaxBracketsResponse, TaxYear } from '../types/taxes'

export async function fetchTaxBrackets(
  year: TaxYear
): Promise<TaxBracketsResponse> {
  const url = getApiUrl(`/tax-calculator/tax-year/${year}`)

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(config.api.timeout),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch tax brackets: ${response.status} ${response.statusText}`
      )
    }

    const data: TaxBracketsResponse = await response.json()

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API Error: ${error.message}`)
    }
    throw new Error('Unknown error occurred')
  }
}
