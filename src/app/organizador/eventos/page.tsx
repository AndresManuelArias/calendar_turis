import { AuthGuard } from "@/infrastructure/driving/next/components/AuthGuard"

export default function OrganizadorEventosPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Panel del Organizador</h1>
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
