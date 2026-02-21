import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { DirectionProvider } from '@/components/ui/direction'

import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { ThemeProvider } from '@/components/theme-provider'
import LastReadFloat from '@/components/last-read-float'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { NotFoundComponent } from '@/components/not-found'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'zQuran - Baca Quran Praktis',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon-180x180.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'preload',
        href: '/UthmanicHafs1Ver18.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/UthmanicHafs1Ver18.ttf',
        as: 'font',
        type: 'font/ttf',
        crossOrigin: 'anonymous',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <HeadContent />
      </head>
      <body>
        <DirectionProvider direction="rtl">
          <TooltipProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <LastReadFloat />
              </div>
            </ThemeProvider>
          </TooltipProvider>
        </DirectionProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
