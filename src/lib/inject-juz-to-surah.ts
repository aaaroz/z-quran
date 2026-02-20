import type { Ayat, SurahDetail } from '@/apis/quran'
import { JUZ_MAPPING } from './constants'

export interface SurahListItem {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  audioFull: Record<string, string>
}

export interface SurahListItemWithJuz extends SurahListItem {
  juz: Array<number>
}

export interface AyatWithJuz extends Ayat {
  juz: number
}

export interface SurahWithJuz extends Omit<SurahDetail, 'ayat'> {
  ayat: Array<AyatWithJuz>
}

export interface JuzMapping {
  juz: number
  surah: number
  startAyat: number
  endAyat: number
}

const juzMapping = JUZ_MAPPING as Array<JuzMapping>

export function injectJuzToSurah(surah: SurahDetail): SurahWithJuz {
  return {
    ...surah,
    ayat: surah.ayat.map((ayat) => {
      const found = juzMapping.find(
        (j) =>
          j.surah === surah.nomor &&
          ayat.nomorAyat >= j.startAyat &&
          ayat.nomorAyat <= j.endAyat,
      )

      if (!found) {
        throw new Error(
          `Juz not found for Surah ${surah.nomor} Ayat ${ayat.nomorAyat}`,
        )
      }

      return {
        ...ayat,
        juz: found.juz,
      }
    }),
  }
}

/**
 * Inject juz array into surah list
 */
export function injectJuzToSurahList(
  surahList: Array<SurahListItem>,
): Array<SurahListItemWithJuz> {
  return surahList.map((surah) => {
    const juzSet = new Set<number>()

    for (const j of juzMapping) {
      if (j.surah === surah.nomor) {
        juzSet.add(j.juz)
      }
    }

    return {
      ...surah,
      juz: Array.from(juzSet).sort((a, b) => a - b),
    }
  })
}
