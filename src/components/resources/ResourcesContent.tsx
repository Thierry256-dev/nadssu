'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Search, FileText, Download, Calendar, Filter } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { formatFileSize } from '@/lib/utils'
import type { Resource } from '@/lib/types'

const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
}

interface ResourcesContentProps {
  resources: Resource[]
}

export function ResourcesContent({ resources }: ResourcesContentProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(resources.map((r) => r.category)))
    return ['All', ...cats]
  }, [resources])

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = category === 'All' || r.category === category
      const matchSearch = !search.trim() ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.description ?? '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [resources, category, search])

  return (
    <section className="py-12 bg-white">
      <div className="container-site">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="w-full pl-9 pr-4 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resource list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-powder rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">
              {resources.length === 0
                ? 'No resources have been published yet. Check back soon.'
                : 'No resources match your search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:shadow-sm transition-all"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-sm mb-0.5 truncate">{resource.title}</div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{resource.category}</span>
                    {resource.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {format(parseISO(resource.published_at), 'd MMM yyyy')}
                      </span>
                    )}
                    {resource.file_type && (
                      <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded font-semibold">
                        {FILE_TYPE_LABELS[resource.file_type] ?? resource.file_type}
                      </span>
                    )}
                    {resource.file_size_bytes && (
                      <span>{formatFileSize(resource.file_size_bytes)}</span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{resource.description}</p>
                  )}
                </div>
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={resource.file_name ?? true}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Download size={13} />
                  Download
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
