import { AuthGuard } from "@/infrastructure/driving/next/components/AuthGuard"
import { CrearEventoForm } from "@/infrastructure/driving/next/components/CrearEventoForm"

export default function NuevoEventoPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Crear Evento</h1>
        <CrearEventoForm />
      </div>
    </AuthGuard>
  )
}
