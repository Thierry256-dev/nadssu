'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, Calendar, ImageIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { NewsPost } from '@/lib/types'

interface LatestNewsProps {
  posts: NewsPost[]
}

export function LatestNews({ posts }: LatestNewsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-powder py-14 lg:py-20" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-navy mb-1">Latest Updates</h2>
            <p className="text-muted-foreground text-sm">News and announcements from NADSSU</p>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
          >
            View all news <ArrowRight size={14} />
          </Link>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center py-16 bg-white rounded-2xl border border-border"
          >
            <p className="text-muted-foreground text-sm">No news articles published yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Check back soon for updates.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <Link href={`/news/${post.slug}`} className="block">
                  <div className="relative aspect-[16/9] bg-powder">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={32} className="text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/news/${post.slug}`}>
                    <h3 className="font-bold text-navy text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  {post.summary && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {post.published_at
                        ? format(parseISO(post.published_at), 'MMM d, yyyy')
                        : 'Unpublished'}
                    </div>
                    <Link
                      href={`/news/${post.slug}`}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Read story →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold"
          >
            View all news <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
