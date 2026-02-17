import type { Surah } from '@/apis/quran'
import { Link } from '@tanstack/react-router'

interface SurahCardProps {
  surah: Surah
}

const SurahCard = ({ surah }: SurahCardProps) => (
  <Link
    to={`/surah/${surah.nomor}`}
    className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
      {surah.nomor}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {surah.namaLatin}
        </h3>
        <span className="font-arabic text-lg text-primary shrink-0">
          {surah.nama}
        </span>
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{surah.tempatTurun}</span>
        <span>·</span>
        <span>{surah.jumlahAyat} ayat</span>
        <span>·</span>
        <span className="truncate">{surah.arti}</span>
      </div>
    </div>
  </Link>
)

export default SurahCard
