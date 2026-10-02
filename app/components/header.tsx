import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <header className="shrink-0 flex items-center justify-between h-12 px-4 bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-20">
      {isMobile
        ? (
          <button
            type="button"
            aria-label="Abrir menú lateral de navegación"
            className='flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        )
        : <div className="w-8"></div>}
      
      <div className='flex items-center space-x-2.5 truncate'>
        <AppIcon size="small" />
        <span className="text-sm text-gray-900 font-semibold tracking-tight truncate">{title}</span>
      </div>

      {isMobile
        ? (
          <button
            type="button"
            aria-label="Crear nuevo chat"
            className='flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors'
            onClick={() => onCreateNewChat?.()}
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
        )
        : <div className="w-8"></div>}
    </header>
  )
}

export default React.memo(Header)
