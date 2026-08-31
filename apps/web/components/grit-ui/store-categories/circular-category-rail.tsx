'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogueCategory } from '@/hooks/use-catalogue'

export default function CircularCategoryRail({
  title = 'Shop by category',
  subtitle = 'Every department, one row.',
  categories = [],
}: {
  title?: string
  subtitle?: string
  categories?: CatalogueCategory[]
}) {
  // const rail = useRef<HTMLUListElement>(null)
  // const [atStart, setAtStart] = useState(true)
  // const [atEnd, setAtEnd] = useState(false)

  /* Derived from scrollLeft, so a swipe or a scrollbar drag updates the
     buttons too. A page counter only knows about button presses. */
  // function sync() {
  //   const el = rail.current
  //   if (!el) return
  //   setAtStart(el.scrollLeft <= 1)
  //   setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)
  // }

  // useEffect(() => {
  //   sync()
  //   const el = rail.current
  //   if (!el) return
  //   /* ResizeObserver as well as scroll: rotating a phone changes how many
  //      tiles fit, which can put a rail that was scrollable at the end. */
  //   const observer = new ResizeObserver(sync)
  //   observer.observe(el)
  //   return () => observer.disconnect()
  // }, [])

  // function scrollByPage(direction: 1 | -1) {
  //   const el = rail.current
  //   if (!el) return
  //   el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
  // }

  return (
    <section className="border-y border-amber-100/60 bg-gradient-to-b from-amber-50/70 to-amber-50/30 py-8 dark:border-white/10 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-8 w-1.5 rounded-full bg-amber-500" />
              <h2 className="text-xl font-bold text-gray-800 md:text-2xl dark:text-white">
                {title}
              </h2>
            </div>
            <p className="ml-[1.125rem] mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              // onClick={() => scrollByPage(-1)}
              // disabled={atStart}
              className="inline-flex size-11 items-center justify-center rounded-full border border-amber-200 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-40 dark:border-white/15 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Scroll categories left</span>
            </button>
            <button
              type="button"
              // onClick={() => scrollByPage(1)}
              // disabled={atEnd}
              className="inline-flex size-11 items-center justify-center rounded-full border border-amber-200 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-40 dark:border-white/15 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Scroll categories right</span>
            </button>
          </div>
        </div>

        <ul
          // ref={rail}
          role="group"
          aria-label={title}
          tabIndex={0}
          // onScroll={sync}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 md:gap-6"
        >
          {categories.map((category) => (
            <li key={category.name} className="w-24 shrink-0 snap-start md:w-28">
              <a
                href={`/categories/`}
                className="group flex flex-col items-center gap-2 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <span
                  className={`white block aspect-square w-full overflow-hidden rounded-full ring-2 ring-white transition-shadow group-hover:shadow-lg`}
                >
                  {/* Decorative: the name is directly beneath it in text. */}
                  <img
                    src={category.image?.url ?? ''}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
                <span className="text-center text-xs font-medium leading-tight text-gray-700 group-hover:text-gray-900 md:text-sm dark:text-gray-300 dark:group-hover:text-white">
                  {category.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
