import Link from "next/link"
import { AuthGuard } from "@/infrastructure/driving/next/components/AuthGuard"
import { Button } from "@/components/ui/button"
import { OrganizadorEventosList } from "@/infrastructure/driving/next/components/OrganizadorEventosList"

export default function OrganizadorEventosPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mis Eventos</h1>
          <Link href="/organizador/eventos/nuevo">
            <Button>Crear Evento</Button>
          </Link>
        </div>
        <OrganizadorEventosList />
      </div>
    </AuthGuard>
  )
}
