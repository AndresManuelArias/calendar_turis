import Link from "next/link"
import { AuthGuard } from "@/infrastructure/driving/next/components/AuthGuard"
import { Button } from "@/components/ui/button"

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
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg text-muted-foreground">
            Bienvenido al panel del organizador. Aquí podrás gestionar tus eventos.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Próximamente podrás crear, editar y eliminar tus eventos desde aquí.
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
