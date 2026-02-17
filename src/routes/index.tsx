import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { surahListOptions } from '@/queries/quran/options'
import { useState } from 'react'
import { Search } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Input } from '@/components/ui/input'
import SkeletonSurahCard from '@/components/surah-card/skeleton'
import SurahCard from '@/components/surah-card'

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(surahListOptions),
  component: App,
})

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isError, isLoading } = useSuspenseQuery(surahListOptions)
  const surahLists = data
  const filtered = surahLists.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.nomor).includes(searchQuery),
  )

  return (
    <div className="container-reading py-8">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <img
          src="/zquran-logo.png"
          alt="logo"
          className="size-14 -mb-2 object-contain"
        />
        <h1 className="text-3xl font-bold text-primary">zQur'an</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Baca Al-Qur'an dengan nyaman dan tenang
        </p>
      </div>

      <div className="relative mb-6">
        <HugeiconsIcon
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          icon={Search}
        />
        <Input
          placeholder="Cari surah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
          Gagal memuat daftar surah. Silakan coba lagi.
        </div>
      )}

      <div className="grid gap-2">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => (
            <SkeletonSurahCard key={i} />
          ))}
        {filtered.map((surah) => (
          <SurahCard key={surah.nomor} surah={surah} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada surah yang ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}
