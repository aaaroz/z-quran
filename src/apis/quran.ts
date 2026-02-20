import {
  injectJuzToSurah,
  injectJuzToSurahList,
  type SurahWithJuz,
  type SurahListItemWithJuz,
} from '@/lib/inject-juz-to-surah'

const BASE_URL = 'https://equran.id/api/v2'

export interface Surah {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  audioFull: Record<string, string>
}

export interface Ayat {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio: Record<string, string>
}

export interface SurahDetail extends Surah {
  ayat: Array<Ayat>
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string } | false
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string } | false
}

export interface TafsirAyat {
  ayat: number
  teks: string
}

export interface TafsirData {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  tafsir: Array<TafsirAyat>
}

export const getSurahList = async (): Promise<Array<SurahListItemWithJuz>> => {
  const response = await fetch(`${BASE_URL}/surat`)
  const data = await response.json()
  return injectJuzToSurahList(data.data)
}

export const getSurahDetail = async (nomor: string): Promise<SurahWithJuz> => {
  const response = await fetch(`${BASE_URL}/surat/${nomor}`)
  const data = await response.json()
  return injectJuzToSurah(data.data)
}

export const getSurahTafsir = async (
  nomor: string,
): Promise<TafsirData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/tafsir/${nomor}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Gagal mengambil Tafsir:', error)
    return null
  }
}
