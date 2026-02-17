import { useSuspenseQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { tafsirOptions } from '@/queries/quran/options'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft } from '@hugeicons/core-free-icons'

export const Route = createFileRoute('/tafsir/$no')({
  loader: ({ context: { queryClient }, params: { no } }) => {
    return queryClient.ensureQueryData(tafsirOptions(no))
  },
  errorComponent: TafsirErrorComponent,
  component: RouteComponent,
})

function TafsirErrorComponent() {
  return (
    <div className="container-reading py-16 text-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>Ups, tafsir tidak ditemukan..</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/">
            <Button>Kembali ke Home</Button>
          </Link>
          <EmptyDescription>
            Butuh bantuan? <a href="#">Kontak kami</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}
function RouteComponent() {
  const no = Route.useParams().no
  const {
    data: tafsir,
    isLoading,
    isError,
  } = useSuspenseQuery(tafsirOptions(no))

  // eslint-disable-next-line
  if (isLoading) {
    return (
      <div className="container-reading py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-48 mx-auto" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 py-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    )
  }
  if (isError || !tafsir) {
    return <TafsirErrorComponent />
  }

  return (
    <div className="container-reading py-8">
      <Link
        to="/surah/$no"
        params={{ no }}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <HugeiconsIcon className="h-4 w-4" icon={ArrowLeft} />
        Kembali ke surah
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-foreground">
          Tafsir {tafsir.namaLatin}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tafsir.arti} · {tafsir.jumlahAyat} ayat
        </p>
      </div>

      <div className="divide-y">
        {tafsir.tafsir.map((item) => (
          <div key={item.ayat} className="py-6">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mb-3">
              {item.ayat}
            </span>
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {item.teks}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
