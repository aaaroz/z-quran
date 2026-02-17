import { create } from 'zustand'

interface AudioState {
  currentAudio: HTMLAudioElement | null
  playingId: string | null
  autoPlaySurah: number | null
  autoPlayQari: string | null
  play: (id: string, url: string, surahNomor?: number, qariKey?: string) => void
  stop: () => void
  onAyatEnded:
    | ((surahNomor: number, currentAyat: number, qariKey: string) => void)
    | null
  setOnAyatEnded: (
    cb:
      | ((surahNomor: number, currentAyat: number, qariKey: string) => void)
      | null,
  ) => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  playingId: null,
  autoPlaySurah: null,
  autoPlayQari: null,
  onAyatEnded: null,
  setOnAyatEnded: (cb) => set({ onAyatEnded: cb }),
  play: (id, url, surahNomor, qariKey) => {
    const { currentAudio, playingId } = get()
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    if (playingId === id) {
      set({
        currentAudio: null,
        playingId: null,
        autoPlaySurah: null,
        autoPlayQari: null,
      })
      return
    }
    const audio = new Audio(url)
    audio.addEventListener('ended', () => {
      const { onAyatEnded } = get()
      set({ currentAudio: null, playingId: null })
      if (onAyatEnded && surahNomor && qariKey) {
        const parts = id.split('-')
        const currentAyat = parseInt(parts[1], 10)
        onAyatEnded(surahNomor, currentAyat, qariKey)
      }
    })
    audio.play()
    set({
      currentAudio: audio,
      playingId: id,
      autoPlaySurah: surahNomor || null,
      autoPlayQari: qariKey || null,
    })
  },
  stop: () => {
    const { currentAudio } = get()
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    set({
      currentAudio: null,
      playingId: null,
      autoPlaySurah: null,
      autoPlayQari: null,
    })
  },
}))
