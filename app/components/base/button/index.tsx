import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export interface IButtonProps {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLDivElement>
  ariaLabel?: string
  title?: string
  tabIndex?: number
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
  ariaLabel,
  title,
  tabIndex,
}) => {
  let style = 'cursor-pointer'
  switch (type) {
    case 'link':
      style = disabled ? 'border-solid border border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400' : 'border-solid border border-gray-200 cursor-pointer text-primary-600 bg-white hover:bg-gray-50 hover:border-gray-300'
      break
    case 'primary':
      style = (disabled || loading) ? 'bg-primary-600/75 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow'
      break
    default:
      style = disabled ? 'border-solid border border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400' : 'border-solid border border-gray-200 cursor-pointer text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300'
      break
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
      e.preventDefault()
      onClick(e as any)
    }
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title}
      disabled={disabled || loading}
      tabIndex={tabIndex ?? (disabled ? -1 : 0)}
      onKeyDown={handleKeyDown}
      className={}
      onClick={disabled ? undefined : onClick as any}
    >
      {children}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </button>
  )
}

export default React.memo(Button)
