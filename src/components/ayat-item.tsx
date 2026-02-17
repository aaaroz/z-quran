import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Bookmark,
  BookOpenCheck,
  Play,
  Square,
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { useBookmarkStore } from '@/stores/bookmark-store'
import { useAudioStore } from '@/stores/audio-store'
import { useLastReadStore } from '@/stores/last-read-store'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const QARI_NAMES: Record<string, string> = {
  '01': 'Abdullah Al-Juhany',
  '02': 'Abdul Muhsin Al-Qasim',
  '03': 'Abdurrahman as-Sudais',
  '04': 'Ibrahim Al-Dossari',
  '05': 'Misyari Rasyid Al-Afasi',
  '06': 'Yasser Al-Dosari',
}

interface AyatItemProps {
  nomorAyat: number
  teksArab: string
  teksLatin?: string
  teksIndonesia: string
  surahNomor: number
  surahName: string
  audio?: Record<string, string>
  showLatin?: boolean
}

const AyatItem = ({
  nomorAyat,
  teksArab,
  teksLatin,
  teksIndonesia,
  surahNomor,
  surahName,
  audio,
  showLatin,
}: AyatItemProps) => {
  const { toggleBookmark, isBookmarked } = useBookmarkStore()
  const { play, playingId } = useAudioStore()
  const { lastRead, setLastRead } = useLastReadStore()
  const bookmarked = isBookmarked(surahNomor, nomorAyat)
  const isLastRead =
    lastRead?.surah === surahNomor && lastRead.ayat === nomorAyat

  const isAnyPlaying = Object.keys(audio || {}).some(
    (key) => playingId === `${surahNomor}-${nomorAyat}-${key}`,
  )

  return (
    <div id={`ayat-${nomorAyat}`} className="group py-6">
      <div className="flex items-center justify-between mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {nomorAyat}
        </span>
        <div className="flex items-center gap-1">
          {audio && Object.keys(audio).length > 0 && (
            <Popover>
              <Tooltip>
                <TooltipTrigger>
                  <PopoverTrigger>
                    <button
                      className={`rounded-md p-2 transition-colors ${
                        isAnyPlaying
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                      aria-label="Putar audio"
                    >
                      {isAnyPlaying ? (
                        <HugeiconsIcon
                          className="h-4 w-4 fill-current"
                          icon={Square}
                        />
                      ) : (
                        <HugeiconsIcon className="h-4 w-4" icon={Play} />
                      )}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Putar Ayat</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2" align="end">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Pilih Qari
                </p>
                {Object.entries(audio).map(([key, url]) => {
                  const audioId = `${surahNomor}-${nomorAyat}-${key}`
                  const isPlaying = playingId === audioId
                  return (
                    <button
                      key={key}
                      onClick={() => play(audioId, url, surahNomor, key)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isPlaying
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {isPlaying ? (
                        <HugeiconsIcon
                          className="h-3 w-3 fill-current"
                          icon={Square}
                        />
                      ) : (
                        <HugeiconsIcon className="h-3 w-3" icon={Play} />
                      )}
                      {QARI_NAMES[key] || `Qari ${key}`}
                    </button>
                  )
                })}
              </PopoverContent>
            </Popover>
          )}

          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() =>
                  setLastRead({ surah: surahNomor, ayat: nomorAyat, surahName })
                }
                className={`rounded-md p-2 transition-colors ${
                  isLastRead
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                aria-label="Tandai terakhir dibaca"
              >
                <HugeiconsIcon className="size-4" icon={BookOpenCheck} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Tandai Terakhir Dibaca</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() =>
                  toggleBookmark({
                    surah: surahNomor,
                    ayat: nomorAyat,
                    surahName,
                    teksArab,
                    teksIndonesia,
                  })
                }
                className={`rounded-md p-2 transition-colors ${
                  bookmarked
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                aria-label={bookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
              >
                <HugeiconsIcon
                  className={cn('size-4', bookmarked ? 'fill-current' : '')}
                  icon={Bookmark}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>Simpan ke Bookmark</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <p className="arabic-text text-right text-3xl leading-[2.4] text-foreground mb-4">
        {teksArab}
      </p>
      {showLatin && teksLatin && (
        <p className="text-sm leading-relaxed text-primary/70 italic mb-2">
          {teksLatin}
        </p>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {teksIndonesia}
      </p>
    </div>
  )
}

export default AyatItem
