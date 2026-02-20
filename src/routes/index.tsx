import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { surahListOptions } from '@/queries/quran/options'
import { useState } from 'react'
import { Search } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Input } from '@/components/ui/input'
import SkeletonSurahCard from '@/components/surah-card/skeleton'
import SurahCard from '@/components/surah-card'
import { JUZ_MAPPING } from '@/lib/constants'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

const QUICK_SURAH = [
  { label: 'Ar-Rahman', surah: 55 },
  { label: 'Al-Waqiah', surah: 56 },
  { label: 'Yasin', surah: 36 },
  { label: 'Al-Mulk', surah: 67 },
  { label: 'Al-Kahf', surah: 18 },
  { label: 'Ayat Kursi', surah: 2, ayat: 255 },
]
const FIRST_AYAT_PER_JUZ = Object.values(
  JUZ_MAPPING.reduce<Record<number, (typeof JUZ_MAPPING)[number]>>(
    (acc, item) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[item.juz]) {
        acc[item.juz] = {
          juz: item.juz,
          surah: item.surah,
          startAyat: item.startAyat,
          endAyat: item.endAyat,
        }
      }
      return acc
    },
    {},
  ),
)

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(surahListOptions),
  component: App,
})

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isError, isLoading } = useSuspenseQuery(surahListOptions)
  const surahLists = data
  const surahMap = new Map(surahLists.map((s) => [s.nomor, s]))
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
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {QUICK_SURAH.map((item) => (
          <Link
            key={item.label}
            to="/surah/$no"
            params={{ no: String(item.surah) }}
            hash={item.ayat ? `ayat-${item.ayat}` : undefined}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
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
        <Popover>
          <PopoverTrigger>
            <Button>Pilih Juz</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <Command>
              <CommandInput placeholder="Cari Juz..." />
              <CommandList>
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {FIRST_AYAT_PER_JUZ.map((j) => {
                    const surah = surahMap.get(j.surah)

                    return (
                      <CommandItem
                        key={j.juz}
                        value={`juz-${j.juz} surah-${surah?.namaLatin}`}
                        onSelect={() => {
                          window.location.href = `/surah/${j.surah}#ayat-${j.startAyat}`
                        }}
                        className="flex w-full items-center justify-between"
                        hideShortcut
                      >
                        {/* Left */}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Juz {j.juz}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {surah?.namaLatin}
                          </span>
                        </div>

                        {/* Right */}
                        <div className="text-right leading-tight">
                          <p className="arabic-text text-sm text-primary">
                            {surah?.nama}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ayat {j.startAyat}
                          </p>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
