import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BatchFileItem } from '@/lib/extraction-types'

export function BatchFileList({ items }: { items: BatchFileItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isProcessing = item.status === 'extracting' || item.status === 'sending'
        return (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
              item.status === 'completed' && 'border-green-200 bg-green-50/50',
              item.status === 'error' && 'border-red-200 bg-red-50/50',
              (item.status === 'pending' || isProcessing) && 'border-border/60',
            )}
          >
            {item.status === 'pending' && (
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            {isProcessing && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-500" />}
            {item.status === 'completed' && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            )}
            {item.status === 'error' && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
            <span className="truncate flex-1" title={item.error || item.file.name}>
              {item.file.name}
            </span>
            <span
              className={cn(
                'text-xs font-medium shrink-0',
                item.status === 'completed' && 'text-green-600',
                item.status === 'error' && 'text-red-500',
                item.status === 'pending' && 'text-muted-foreground',
                isProcessing && 'text-blue-500',
              )}
            >
              {item.statusLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}
