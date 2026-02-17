import { surahOptions } from '@/queries/quran/options'
import { useAudioStore } from '@/stores/audio-store'
import { createFileRoute, Link, useLocation } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft, BookOpen, Type } from '@hugeicons/core-free-icons'
import AyatItem from '@/components/ayat-item'
import { Separator } from '@/components/ui/separator'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/surah/$no')({
  loader: ({ context: { queryClient }, params: { no } }) => {
    return queryClient.ensureQueryData(surahOptions(no))
  },
  errorComponent: SurahErrorComponent,
  component: RouteComponent,
})

function SurahErrorComponent() {
  return (
    <div className="container-reading py-16 text-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>Ups, surah tidak ditemukan..</EmptyDescription>
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
  const location = useLocation()
  const [showLatin, setShowLatin] = useState(false)
  const stop = useAudioStore((s) => s.stop)
  const play = useAudioStore((s) => s.play)
  const setOnAyatEnded = useAudioStore((s) => s.setOnAyatEnded)

  const no = Route.useParams().no

  const { data: surah, isLoading } = useSuspenseQuery(surahOptions(no))

  const handleAyatEnded = useCallback(
    (surahNomor: number, currentAyat: number, qariKey: string) => {
      if (surah.nomor !== surahNomor) return
      const nextAyat = surah.ayat.find((a) => a.nomorAyat === currentAyat + 1)
      if (nextAyat?.audio.qariKey) {
        const nextId = `${surahNomor}-${nextAyat.nomorAyat}-${qariKey}`
        play(nextId, nextAyat.audio[qariKey], surahNomor, qariKey)
        const el = document.getElementById(`ayat-${nextAyat.nomorAyat}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    [surah, play],
  )

  useEffect(() => {
    setOnAyatEnded(handleAyatEnded)
    return () => setOnAyatEnded(null)
  }, [handleAyatEnded, setOnAyatEnded])

  useEffect(() => {
    return () => stop()
  }, [no, stop])

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.hash, surah])

  // eslint-disable-next-line
  if (isLoading) {
    return (
      <div className="container-reading py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3 py-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container-reading py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon className="h-4 w-4" icon={ArrowLeft} />
          Kembali
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLatin((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              showLatin
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Toggle teks latin"
          >
            <HugeiconsIcon className="size-3.5" icon={Type} />
            Latin
          </button>
          <Link
            to="/tafsir/$no"
            params={{ no }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon className="size-3.5" icon={BookOpen} />
            Tafsir
          </Link>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-arabic text-3xl text-primary">{surah.nama}</h1>
        <h2 className="mt-1 text-xl font-semibold text-foreground">
          {surah.namaLatin}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {surah.arti} · {surah.tempatTurun} · {surah.jumlahAyat} ayat
        </p>
      </div>

      {surah.nomor !== 1 && surah.nomor !== 9 && (
        <p className="arabic-text text-center text-2xl text-primary/80 mb-6">
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
      )}

      <div className="divide-y divide-border">
        {surah.ayat.map((ayat) => (
          <AyatItem
            key={ayat.nomorAyat}
            nomorAyat={ayat.nomorAyat}
            teksArab={ayat.teksArab}
            teksLatin={ayat.teksLatin}
            teksIndonesia={ayat.teksIndonesia}
            surahNomor={surah.nomor}
            surahName={surah.namaLatin}
            audio={ayat.audio}
            showLatin={showLatin}
          />
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between text-sm">
        {surah.suratSebelumnya ? (
          <Link
            to="/surah/$no"
            params={{ no: String(surah.suratSebelumnya.nomor) }}
            className="text-primary hover:underline"
          >
            ← {surah.suratSebelumnya.namaLatin}
          </Link>
        ) : (
          <span />
        )}
        {surah.suratSelanjutnya ? (
          <Link
            to="/surah/$no"
            params={{ no: String(surah.suratSelanjutnya.nomor) }}
            className="text-primary hover:underline"
          >
            {surah.suratSelanjutnya.namaLatin} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
  return <div>Hello "/surah/"!</div>
}
