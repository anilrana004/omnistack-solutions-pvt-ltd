'use client'

interface ContentSkeletonProps {
  variant?: 'card' | 'list' | 'hero' | 'text' | 'image' | 'grid'
  count?: number
  className?: string
  animate?: boolean
}

export default function ContentSkeleton({
  variant = 'card',
  count = 1,
  className = '',
  animate = true,
}: ContentSkeletonProps) {
  const baseClasses = `
    bg-gradient-to-r from-white/10 via-white/5 to-white/10 
    ${animate ? 'animate-pulse' : ''}
    ${className}
  `

  const renderSkeleton = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className={`${baseClasses} rounded-xl p-8 md:p-12`}>
            <div className="max-w-2xl">
              {/* Title */}
              <div className="h-12 md:h-16 bg-white/10 rounded-lg mb-4" />
              <div className="h-6 md:h-8 bg-white/10 rounded-lg mb-6 w-3/4" />
              
              {/* Subtitle */}
              <div className="h-4 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-white/10 rounded mb-2 w-5/6" />
              <div className="h-4 bg-white/10 rounded mb-8 w-2/3" />
              
              {/* Buttons */}
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-white/10 rounded-lg" />
                <div className="h-12 w-28 bg-white/10 rounded-lg" />
              </div>
            </div>
          </div>
        )

      case 'card':
        return (
          <div className={`${baseClasses} rounded-xl p-6`}>
            {/* Image placeholder */}
            <div className="aspect-video bg-white/10 rounded-lg mb-4" />
            
            {/* Title */}
            <div className="h-6 bg-white/10 rounded mb-3" />
            
            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-4/5" />
              <div className="h-4 bg-white/10 rounded w-3/5" />
            </div>
            
            {/* Button */}
            <div className="h-10 w-24 bg-white/10 rounded-lg" />
          </div>
        )

      case 'list':
        return (
          <div className={`${baseClasses} rounded-xl p-4`}>
            <div className="flex items-center space-x-4">
              {/* Icon/Image */}
              <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0" />
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className={`space-y-3 ${className}`}>
            <div className="h-6 bg-white/10 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className={`${baseClasses} aspect-video rounded-lg`} />
        )

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className={`${baseClasses} rounded-xl p-6`}>
                <div className="aspect-video bg-white/10 rounded-lg mb-4" />
                <div className="h-5 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded mb-2 w-4/5" />
                <div className="h-4 bg-white/10 rounded w-3/5" />
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className={`${baseClasses} h-20 rounded-lg`} />
        )
    }
  }

  if (variant === 'grid' || count === 1) {
    return renderSkeleton()
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

// Specialized skeleton components
export function HeroSkeleton({ className }: { className?: string }) {
  return <ContentSkeleton variant="hero" className={className} />
}

export function CardSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return <ContentSkeleton variant="card" count={count} className={className} />
}

export function ListSkeleton({ count = 5, className }: { count?: number; className?: string }) {
  return <ContentSkeleton variant="list" count={count} className={className} />
}

export function TextSkeleton({ className }: { className?: string }) {
  return <ContentSkeleton variant="text" className={className} />
}

export function ImageSkeleton({ className }: { className?: string }) {
  return <ContentSkeleton variant="image" className={className} />
}

export function GridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return <ContentSkeleton variant="grid" count={count} className={className} />
}