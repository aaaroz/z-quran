import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useBookmarkStore } from '@/stores/bookmark-store'
import { BookMarked, BookmarkX, Trash2 } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/bookmarks')({
  component: RouteComponent,
})

function RouteComponent() {
  const { bookmarks, toggleBookmark } = useBookmarkStore()
  return (
    <div className="container-reading py-8">
      <div className="mb-8 text-center">
        <HugeiconsIcon
          className="mx-auto h-8 w-8 text-primary"
          icon={BookMarked}
        />
        <h1 className="mt-2 text-xl font-semibold text-foreground">Bookmark</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ayat yang telah kamu simpan
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={BookmarkX} />
              </EmptyMedia>
              <EmptyTitle>Bookmark kosong</EmptyTitle>
              <EmptyDescription>
                Belum ada bookmark yang disimpan saat ini.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link to="/">
                <Button>Mulai membaca Qur'an</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="divide-y">
          {bookmarks.map((b) => (
            <div
              key={`${b.surah}-${b.ayat}`}
              className="flex items-center gap-4 p-4 border"
            >
              <Link
                // to={`/surah/${b.surah}#ayat-${b.ayat}`}
                to="/surah/$no"
                params={{ no: `${b.surah}` }}
                hash={`ayat-${b.ayat}`}
                className="flex-1 min-w-0 group "
              >
                <p className="text-xs font-medium text-primary">
                  {b.surahName || `Surah ${b.surah}`} : {b.ayat}
                </p>
                {b.teksArab && (
                  <p className="arabic-text mt-1 text-right text-lg text-foreground line-clamp-1">
                    {b.teksArab}
                  </p>
                )}
                {b.teksIndonesia && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {b.teksIndonesia}
                  </p>
                )}
              </Link>
              <button
                onClick={() => toggleBookmark(b)}
                className="shrink-0 rounded-md p-2 text-muted-foreground/40 hover:text-destructive transition-colors"
                aria-label="Hapus bookmark"
              >
                <HugeiconsIcon className="h-4 w-4" icon={Trash2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
