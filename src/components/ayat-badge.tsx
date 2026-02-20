import { cn } from '@/lib/utils'

function toArabicNumber(value: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  return value
    .toString()
    .split('')
    .map((char) => (/\d/.test(char) ? arabicDigits[Number(char)] : char))
    .join('')
}

type AyatBadgeProps = {
  number: number
  className?: string
}
export function AyatBadge({ number, className }: AyatBadgeProps) {
  return (
    <span
      className={cn(
        'font-arabic-lateef align-baseline whitespace-nowrap [unicode-bidi:isolate]',
        className,
      )}
    >
      {'\u06DD'}
      {toArabicNumber(number)}
    </span>
  )
}
