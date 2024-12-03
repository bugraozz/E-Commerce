'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  alt: string
  linkHref: string
  buttonText: string
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt, linkHref, buttonText }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000) // Change image every 7 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="w-full h-full relative">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${index + 1}`}
          fill
          className={`object-cover transition-all duration-1000 ${
            index === currentImageIndex ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <Button variant="secondary" size="lg" asChild>
          <a href={linkHref}>{buttonText}</a>
        </Button>
      </div>
    </div>
  )
}

export default ImageCarousel