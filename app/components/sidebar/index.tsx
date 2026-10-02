'use client'
import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  FolderIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon,
  FolderIcon as FolderSolidIcon,
} from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 50
const FOLDERS_STORAGE_KEY = 'agent_project_folders'
const ACTIVE_FOLDER_STORAGE_KEY = 'agent_active_folder_id'
const CONVERSATION_FOLDER_MAP_KEY = 'agent_conv_folder_map'

export interface IFolder {
  id: string
  name: string
  createdAt: number
}

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  activeFolder?: string | null
  onActiveFolderChange?: (folderName: string | null) => void
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onActiveFolderChange,
}) => {
  const { t } = useTranslation()
  const [folders, setFolders] = useState<IFolder[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [convFolderMap, setConvFolderMap] = useState<Record<string, string>>({})
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({})

  // Load folders & mapping on mount
  useEffect(() => {
    try {
      const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY)
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders))
      } else {
        const defaultFolders: IFolder[] = [
          { id: 'folder_general', name: 'General', createdAt: Date.now() },
          { id: 'folder_landing', name: 'Landing Pages', createdAt: Date.now() + 1 },
        ]
        setFolders(defaultFolders)
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(defaultFolders))
      }

      const savedActiveFolder = localStorage.getItem(ACTIVE_FOLDER_STORAGE_KEY)
      if (savedActiveFolder) {
        setActiveFolderId(savedActiveFolder)
      }

      const savedMap = localStorage.getItem(CONVERSATION_FOLDER_MAP_KEY)
      if (savedMap) {
        setConvFolderMap(JSON.parse(savedMap))
      }
    } catch (e) {
      console.warn('Storage load failed', e)
    }
  }, [])

  // Sync active folder name upward to parent component
  useEffect(() => {
    if (onActiveFolderChange) {
      if (activeFolderId) {
        const found = folders.find(f => f.id === activeFolderId)
        onActiveFolderChange(found ? found.name : null)
      } else {
        onActiveFolderChange(null)
      }
    }
    try {
      if (activeFolderId) {
        localStorage.setItem(ACTIVE_FOLDER_STORAGE_KEY, activeFolderId)
      } else {
        localStorage.removeItem(ACTIVE_FOLDER_STORAGE_KEY)
      }
    } catch (e) {}
  }, [activeFolderId, folders, onActiveFolderChange])

  const handleCreateFolder = () => {
    const name = window.prompt('Nombre de la nueva carpeta / proyecto:')
    if (!name || !name.trim()) return
    const newFolder: IFolder = {
      id: `folder_${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
    }
    const updated = [...folders, newFolder]
    setFolders(updated)
    setActiveFolderId(newFolder.id)
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {}
  }

  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('¿Deseas eliminar esta carpeta? Las conversaciones pasarán al nivel general.')) return
    const updated = folders.filter(f => f.id !== folderId)
    setFolders(updated)
    if (activeFolderId === folderId) {
      setActiveFolderId(null)
    }
    const updatedMap = { ...convFolderMap }
    Object.keys(updatedMap).forEach(key => {
      if (updatedMap[key] === folderId) {
        delete updatedMap[key]
      }
    })
    setConvFolderMap(updatedMap)
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updated))
      localStorage.setItem(CONVERSATION_FOLDER_MAP_KEY, JSON.stringify(updatedMap))
    } catch (err) {}
  }

  const toggleFolderCollapse = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCollapsedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }))
  }

  const selectFolder = (folderId: string | null) => {
    if (activeFolderId === folderId) {
      setActiveFolderId(null)
    } else {
      setActiveFolderId(folderId)
    }
  }

  // Group conversations by folder
  const unassignedChats = list.filter(item => !convFolderMap[item.id])

  return (
    <aside
      aria-label="Panel lateral de proyectos y conversaciones"
      className="shrink-0 flex flex-col overflow-y-auto bg-gray-50/70 pc:w-[260px] tablet:w-[220px] mobile:w-[260px] border-r border-gray-200/80 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen select-none"
    >
      {/* Action Header */}
      <div className="p-3.5 space-y-2">
        {list.length < MAX_CONVERSATION_LENTH && (
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            ariaLabel="Crear nueva conversación"
            className="w-full !justify-start !h-9 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all"
          >
            <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
          </Button>
        )}

        <button
          type="button"
          onClick={handleCreateFolder}
          aria-label="Crear nueva carpeta de proyecto"
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          <FolderPlusIcon className="w-3.5 h-3.5 text-primary-600" />
          <span>Nueva Carpeta / Proyecto</span>
        </button>
      </div>

      {/* Folders & Navigation Area */}
      <nav aria-label="Estructura de proyectos y conversaciones" className="flex-1 px-3 space-y-3 overflow-y-auto">
        {/* Folders Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-1 text-[11px] font-semibold tracking-wider text-gray-600 uppercase">
            <span>Carpetas & Contexto</span>
            <span className="text-[10px] text-gray-500 font-mono font-medium">{folders.length}</span>
          </div>

          {folders.map(folder => {
            const isActive = activeFolderId === folder.id
            const isCollapsed = !!collapsedFolders[folder.id]
            const folderChats = list.filter(c => convFolderMap[c.id] === folder.id)

            return (
              <div key={folder.id} className="rounded-lg overflow-hidden border border-transparent hover:border-gray-200/60 transition-colors">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => selectFolder(folder.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectFolder(folder.id)
                    }
                  }}
                  aria-label={`Seleccionar carpeta ${folder.name}`}
                  className={classNames(
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    'group flex items-center justify-between px-2.5 py-2 text-xs rounded-lg cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
                  )}
                >
                  <div className="flex items-center space-x-2 truncate flex-1 min-w-0 mr-1">
                    <button
                      type="button"
                      onClick={e => toggleFolderCollapse(folder.id, e)}
                      aria-label={isCollapsed ? `Desplegar carpeta ${folder.name}` : `Colapsar carpeta ${folder.name}`}
                      className="p-0.5 text-gray-400 hover:text-gray-600 rounded focus:outline-none"
                    >
                      {isCollapsed ? (
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isActive ? (
                      <FolderSolidIcon className="w-4 h-4 text-primary-600 shrink-0" />
                    ) : (
                      <FolderIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                    )}
                    <span className="truncate">{folder.name}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[10px] text-gray-400 font-mono">({folderChats.length})</span>
                    <button
                      type="button"
                      onClick={e => handleDeleteFolder(folder.id, e)}
                      aria-label={`Eliminar carpeta ${folder.name}`}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-white focus:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Sub-list of chats within this folder */}
                {!isCollapsed && folderChats.length > 0 && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-gray-200 ml-4 my-1">
                    {folderChats.map(item => {
                      const isCurrent = item.id === currentId
                      const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
                      return (
                        <div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => onCurrentIdChange(item.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onCurrentIdChange(item.id)
                            }
                          }}
                          aria-label={`Abrir chat ${item.name}`}
                          className={classNames(
                            isCurrent
                              ? 'bg-white text-primary-600 shadow-xs font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                            'flex items-center rounded-md px-2 py-1.5 text-xs cursor-pointer truncate transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
                          )}
                        >
                          <ItemIcon className="mr-2 h-3.5 w-3.5 text-primary-600 shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Global / Unassigned Conversations */}
        <div className="space-y-1 pt-2 border-t border-gray-200/60">
          <div className="flex items-center justify-between px-1 text-[11px] font-semibold tracking-wider text-gray-600 uppercase">
            <span>Conversaciones</span>
            <span className="text-[10px] text-gray-500 font-mono font-medium">{unassignedChats.length}</span>
          </div>

          {unassignedChats.length === 0 ? (
            <p className="px-2 py-2 text-xs text-gray-500 italic">Sin chats directos</p>
          ) : (
            unassignedChats.map(item => {
              const isCurrent = item.id === currentId
              const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onCurrentIdChange(item.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onCurrentIdChange(item.id)
                    }
                  }}
                  aria-label={`Abrir conversación ${item.name}`}
                  className={classNames(
                    isCurrent
                      ? 'bg-primary-50 text-primary-600 font-medium shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    'group flex items-center rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
                  )}
                >
                  <ItemIcon
                    className={classNames(
                      isCurrent ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-2.5 h-4 w-4 shrink-0',
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </div>
              )
            })
          )}
        </div>
      </nav>

      {/* Footer info & compliance links */}
      <div className="p-3 border-t border-gray-200/80 bg-gray-50/90 text-center">
        <div className="text-gray-600 font-normal text-[11px] truncate">
          © {copyRight} {(new Date()).getFullYear()}
        </div>
      </div>
    </aside>
  )
}

export default React.memo(Sidebar)
