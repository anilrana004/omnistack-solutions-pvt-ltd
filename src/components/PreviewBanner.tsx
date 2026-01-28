'use client'

import { useState } from 'react'
import { Eye, EyeOff, Edit, X } from 'lucide-react'
import type { PreviewBannerData } from '@/src/lib/sanity.preview'
import { PreviewMode } from '@/src/lib/sanity.preview'

interface PreviewBannerProps extends PreviewBannerData {
  className?: string
}

export default function PreviewBanner({
  isPreview,
  documentType,
  documentId,
  editUrl,
  className = '',
}: PreviewBannerProps) {
  const [isDisabling, setIsDisabling] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  // Don't render if not in preview mode or if hidden
  if (!isPreview || isHidden) {
    return null
  }

  const handleDisablePreview = async () => {
    setIsDisabling(true)
    try {
      const result = await PreviewMode.disable()
      if (result.success) {
        // Reload the page to show published content
        window.location.reload()
      } else {
        console.error('Failed to disable preview:', result.error)
        alert('Failed to disable preview mode. Please try again.')
      }
    } catch (error) {
      console.error('Error disabling preview:', error)
      alert('Failed to disable preview mode. Please try again.')
    } finally {
      setIsDisabling(false)
    }
  }

  const handleEditContent = () => {
    if (editUrl) {
      window.open(editUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[9999]
        bg-gradient-to-r from-blue-600 to-blue-700
        text-white text-sm
        shadow-lg border-b border-blue-500
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Preview indicator */}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Preview Mode</span>
            </div>

            {/* Document info */}
            {documentType && documentId && (
              <div className="text-blue-100 text-xs">
                Editing: {documentType} ({documentId})
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-100 text-xs">
                Viewing draft content
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Edit button */}
            {editUrl && (
              <button
                onClick={handleEditContent}
                className="
                  inline-flex items-center space-x-1 px-3 py-1
                  bg-blue-500 hover:bg-blue-400
                  text-white text-xs font-medium
                  rounded transition-colors
                "
                title="Edit in Sanity Studio"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {/* Disable preview button */}
            <button
              onClick={handleDisablePreview}
              disabled={isDisabling}
              className="
                inline-flex items-center space-x-1 px-3 py-1
                bg-blue-800 hover:bg-blue-700
                disabled:bg-blue-800/50 disabled:cursor-not-allowed
                text-white text-xs font-medium
                rounded transition-colors
              "
              title="Exit preview mode"
            >
              <EyeOff className="w-3 h-3" />
              <span>{isDisabling ? 'Exiting...' : 'Exit Preview'}</span>
            </button>

            {/* Hide banner button */}
            <button
              onClick={() => setIsHidden(true)}
              className="
                p-1 hover:bg-blue-500/50
                text-blue-200 hover:text-white
                rounded transition-colors
              "
              title="Hide banner"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-2 text-blue-100 text-xs">
          You are viewing draft content that is not visible to the public.
          Changes you make in Sanity Studio will appear here immediately.
        </div>
      </div>
    </div>
  )
}

// Hook to use preview banner data
export function usePreviewBanner(
  documentType?: string,
  documentId?: string
): PreviewBannerData & { bodyPadding: string } {
  // Check if we're in preview mode on the client
  const isPreview = typeof window !== 'undefined' 
    ? document.cookie.includes('__sanity_preview')
    : false

  return {
    isPreview,
    documentType,
    documentId,
    editUrl: documentType && documentId 
      ? `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/intent=edit&id=${documentId}&type=${documentType}`
      : undefined,
    bodyPadding: isPreview ? 'pt-20' : '', // Add padding to body when preview banner is shown
  }
}