import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'

export function NotFoundComponent() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>Ups, sepertinya kamu tersesat..</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/">
            <Button>Kembali ke Home</Button>
          </Link>
          <EmptyDescription>
            Butuh bantuan? <a href="#">Kontak kami</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </section>
  )
}
