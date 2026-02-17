import { useState } from 'react'
import { useLastReadStore } from '@/stores/last-read-store'
import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  X,
} from '@hugeicons/core-free-icons'

const LastReadFloat = () => {
  const { lastRead, clearLastRead } = useLastReadStore()
  const [minimized, setMinimized] = useState(false)

  if (!lastRead) return null

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <HugeiconsIcon className="h-4 w-4" icon={BookOpenCheck} />
          <HugeiconsIcon className="h-3.5 w-3.5" icon={ChevronUp} />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="rounded-xl border bg-card p-4 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <HugeiconsIcon className="h-3.5 w-3.5" icon={BookOpenCheck} />
            Terakhir dibaca
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Minimize"
            >
              <HugeiconsIcon className="h-3.5 w-3.5" icon={ChevronDown} />
            </button>
            <button
              onClick={clearLastRead}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Tutup"
            >
              <HugeiconsIcon className="h-3.5 w-3.5" icon={X} />
            </button>
          </div>
        </div>
        <Link
          to="/surah/$no"
          params={{ no: `${lastRead.surah}` }}
          hash={`ayat-${lastRead.ayat}`}
          className="block rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Lanjutkan membaca Ayat {lastRead.ayat} – {lastRead.surahName}
        </Link>
      </div>
    </div>
  )
}

export default LastReadFloat
