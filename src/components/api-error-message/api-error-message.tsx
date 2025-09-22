import type { ReactNode } from 'react'

import styles from './api-error-message.module.css'

interface APIErrorMessageProps {
  title?: string
  message: string
  action?: ReactNode
}

export const APIErrorMessage = ({
  title = 'Error',
  message,
  action,
}: APIErrorMessageProps) => {
  return (
    <div className={styles['error-message']} role="alert">
      <div className={styles['error-message__content']}>
        <h4 className={styles['error-message__title']}>{title}</h4>
        <p>{message}</p>
        {action && (
          <div className={styles['error-message__actions']}>{action}</div>
        )}
      </div>
    </div>
  )
}
