import { getSurahDetail, getSurahList, getSurahTafsir } from '@/apis/quran'
import { queryOptions } from '@tanstack/react-query'

export const surahListOptions = queryOptions({
  queryKey: ['surah-list'],
  queryFn: () => getSurahList(),
})

export const surahOptions = (nomor: string) =>
  queryOptions({
    queryKey: ['surah', { nomor }],
    queryFn: () => getSurahDetail(nomor),
    enabled: !!nomor,
  })

export const tafsirOptions = (nomor: string) =>
  queryOptions({
    queryKey: ['tafsir', { nomor }],
    queryFn: () => getSurahTafsir(nomor),
    enabled: !!nomor,
  })
