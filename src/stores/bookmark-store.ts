import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Bookmark {
  surah: number
  ayat: number
  surahName?: string
  teksArab?: string
  teksIndonesia?: string
}

interface BookmarkState {
  bookmarks: Array<Bookmark>
  toggleBookmark: (bookmark: Bookmark) => void
  isBookmarked: (surah: number, ayat: number) => boolean
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      toggleBookmark: (bookmark) => {
        const exists = get().bookmarks.some(
          (b) => b.surah === bookmark.surah && b.ayat === bookmark.ayat,
        )
        if (exists) {
          set({
            bookmarks: get().bookmarks.filter(
              (b) => !(b.surah === bookmark.surah && b.ayat === bookmark.ayat),
            ),
          })
        } else {
          set({ bookmarks: [...get().bookmarks, bookmark] })
        }
      },
      isBookmarked: (surah, ayat) =>
        get().bookmarks.some((b) => b.surah === surah && b.ayat === ayat),
    }),
    { name: 'zquran-bookmarks' },
  ),
)
