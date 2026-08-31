"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { cn } from "@/lib/utils"
import { img } from "@/data/images"

const slides = [
  {
    eyebrow: "Luxury Watch Brand",
    title: "Timeless Elegance on Your Wrist",
    copy: "Discover watches crafted with precision, premium materials, and designs that last a lifetime.",
    image: img.heroWatch,
    cta: { label: "Explore Collection", to: "/shop" },
  },
  {
    eyebrow: "Aurix Chrono · New Season",
    title: "Precision Built for the Long Run",
    copy: "A tri-register chronograph housed in brushed 316L steel — reads sport by day, dress by night.",
    image: img.chrono1,
    cta: { label: "Shop Chronographs", to: "/categories/chronograph" },
  },
  {
    eyebrow: "Bronze Mariner",
    title: "A Patina That's Yours Alone",
    copy: "Living bronze cases age uniquely with every wear, rated to 200m for the deep end.",
    image: img.diver1,
    cta: { label: "Shop Divers", to: "/categories/diver" },
  },
]

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 6500)
    return () => clearInterval(id)
  }, [emblaApi])

  return (
    <section className="relative overflow-hidden bg-ink text-background">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <div className="absolute inset-0">
                <img src={slide.image} alt="" className="h-full w-full object-cover opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
              </div>
              <div className="container relative flex min-h-[560px] items-center py-20 sm:min-h-[640px]">
                <div className="max-w-xl space-y-6">
                  <p className="eyebrow text-brass-light">{slide.eyebrow}</p>
                  <h1 className="font-display text-4xl leading-[1.08] text-balance sm:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="max-w-md text-base text-background/70">{slide.copy}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="brass" size="lg" asChild>
                      <Link href={slide.cta.to}>
                        {slide.cta.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <div className="flex -space-x-2">
                      {[img.avatar1, img.avatar2, img.avatar3].map((a, idx) => (
                        <img key={idx} src={a} className="h-8 w-8 rounded-full border-2 border-ink object-cover" alt="" />
                      ))}
                    </div>
                    <div>
                      <StarRating rating={4.9} size={12} />
                      <p className="text-xs text-background/60">(1,234 reviews)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center border border-background/20 bg-ink/40 p-2 text-background backdrop-blur transition-colors hover:bg-ink/70 sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center border border-background/20 bg-ink/40 p-2 text-background backdrop-blur transition-colors hover:bg-ink/70 sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn("h-1.5 w-6 transition-colors", i === selected ? "bg-brass" : "bg-background/30")}
          />
        ))}
      </div>
    </section>
  )
}
