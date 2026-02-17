import { HugeiconsIcon } from '@hugeicons/react'
import { BookMarked, Home, MoonIcon, SunIcon } from '@hugeicons/core-free-icons'
import { Link, useLocation } from '@tanstack/react-router'
import { useTheme } from './theme-provider'

const Header = () => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/bookmarks', label: 'Bookmark', icon: BookMarked },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container-reading flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/zquran-logo.png"
            alt="logo"
            className="size-8 object-contain"
          />
          <span className="text-lg font-semibold text-primary">zQur'an</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HugeiconsIcon icon={item.icon} className="size-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle tema"
          >
            {theme === 'dark' ? (
              <HugeiconsIcon icon={SunIcon} className="size-4" />
            ) : (
              <HugeiconsIcon icon={MoonIcon} className="size-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
