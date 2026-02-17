import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LastRead {
  surah: number
  ayat: number
  surahName: string
}

interface LastReadState {
  lastRead: LastRead | null
  setLastRead: (data: LastRead) => void
  clearLastRead: () => void
}

export const useLastReadStore = create<LastReadState>()(
  persist(
    (set) => ({
      lastRead: null,
      setLastRead: (data) => set({ lastRead: data }),
      clearLastRead: () => set({ lastRead: null }),
    }),
    { name: 'zquran-last-read' },
  ),
)
