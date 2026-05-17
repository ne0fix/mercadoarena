'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CourtImageCarouselProps {
  images: string[]
  fallbackUrl: string | null
  name: string
  className?: string
}

export function CourtImageCarousel({ images, fallbackUrl, name, className = '' }: CourtImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  const allImages = images.length > 0 ? images : (fallbackUrl ? [fallbackUrl] : [])
  const hasMultiple = allImages.length > 1

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent((c) => (c - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent((c) => (c + 1) % allImages.length)
  }, [allImages.length])

  if (allImages.length === 0) {
    return (
      <div className={`w-full h-full bg-secondary-container flex items-center justify-center ${className}`}>
        <span className="font-headline text-primary text-2xl font-bold">{name[0]}</span>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Image
        key={allImages[current]}
        src={allImages[current]}
        alt={`${name} - foto ${current + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
