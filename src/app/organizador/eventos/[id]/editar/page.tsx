import { AuthGuard } from "@/infrastructure/driving/next/components/AuthGuard"
import { EditarEventoForm } from "@/infrastructure/driving/next/components/EditarEventoForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Editar Evento</h1>
        <EditarEventoForm eventoId={id} />
      </div>
    </AuthGuard>
  )
}
