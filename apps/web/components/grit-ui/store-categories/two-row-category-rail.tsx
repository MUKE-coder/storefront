'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogueCategory } from '@/hooks/use-catalogue'

export default function CategoryListing({
  title,
  categories = [],
}: {
  title?: string
  categories?: CatalogueCategory[]
}) {
  return (
    <section className="bg-gray-50 py-10 dark:bg-gray-950">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        <ul className="grid grid-cols-6">
          {categories.map((category) => (
            <li key={category.name} className="">
              <a
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center gap-2 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                <span
                  className={`block aspect-square w-full overflow-hidden rounded-full bg-gray-100 transition-shadow group-hover:shadow-lg`}
                >
                  {/* Decorative: the name is directly beneath it in text. */}
                  <img
                    src={category.image?.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-center text-sm leading-tight text-gray-800 group-hover:underline dark:text-gray-200">
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
