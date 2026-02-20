import type { SurahListItemWithJuz } from '@/lib/inject-juz-to-surah'
import { Link } from '@tanstack/react-router'

interface SurahCardProps {
  surah: SurahListItemWithJuz
}

const SurahCard = ({ surah }: SurahCardProps) => {
  const visibleJuz = surah.juz.slice(0, 3)
  const remaining = surah.juz.length - visibleJuz.length

  return (
    <Link
      to="/surah/$no"
      params={{ no: String(surah.nomor) }}
      className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      {/* Nomor */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
        {surah.nomor}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {surah.namaLatin}
          </h3>

          <span className="font-arabic text-lg text-primary shrink-0">
            {surah.nama}
          </span>
        </div>

        {/* Meta Info */}
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{surah.tempatTurun}</span>
          <span>·</span>
          <span>{surah.jumlahAyat} ayat</span>
          <span>·</span>
          <span className="truncate">{surah.arti}</span>
        </div>

        {/* Juz Badges */}
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {visibleJuz.map((j) => (
            <span
              key={j}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
            >
              Juz {j}
            </span>
          ))}

          {remaining > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              +{remaining}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default SurahCard
