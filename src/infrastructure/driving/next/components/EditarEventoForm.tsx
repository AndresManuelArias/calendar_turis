"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Ciudad {
  id: string
  nombre: string
}

interface Interes {
  id: string
  nombre: string
}

interface ActividadItem {
  id: number
  nombre: string
  descripcion: string
  horaInicio: string
  horaFin: string
}

interface MediaItem {
  id: number
  urlArchivo: string
  tipo: "IMAGEN" | "VIDEO_EMBEDDED"
}

interface ParticipanteItem {
  id: number
  nombre: string
  rolOPerfil: string
}

interface PatrocinadorItem {
  id: number
  nombre: string
  descripcion: string
  logoUrl: string
  sitioWeb: string
}

let nextId = 1
function nuevoId() {
  return nextId++
}

interface EditarEventoFormProps {
  eventoId: string
}

export function EditarEventoForm({ eventoId }: EditarEventoFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [cargandoEvento, setCargandoEvento] = useState(true)

  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [interesesDisponibles, setInteresesDisponibles] = useState<Interes[]>([])

  const [titulo, setTitulo] = useState("")
  const [objetivo, setObjetivo] = useState("")
  const [publicoObjetivo, setPublicoObjetivo] = useState("")
  const [descripcionItinerario, setDescripcionItinerario] = useState("")
  const [observaciones, setObservaciones] = useState("")

  const [fechaInicio, setFechaInicio] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [horaFin, setHoraFin] = useState("")
  const [ciudadId, setCiudadId] = useState("")
  const [lugarDireccion, setLugarDireccion] = useState("")

  const [esGratuito, setEsGratuito] = useState(false)
  const [costoEntrada, setCostoEntrada] = useState("")
  const [urlTicketeraExterna, setUrlTicketeraExterna] = useState("")

  const [actividades, setActividades] = useState<ActividadItem[]>([])
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [participantes, setParticipantes] = useState<ParticipanteItem[]>([])
  const [patrocinadores, setPatrocinadores] = useState<PatrocinadorItem[]>([])
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function cargarCiudades() {
      try {
        const res = await fetch("/api/ciudades")
        const json = await res.json()
        if (json.data) setCiudades(json.data)
      } catch {
        console.error("Error al cargar ciudades")
      }
    }
    async function cargarIntereses() {
      try {
        const res = await fetch("/api/intereses")
        const json = await res.json()
        if (json.data) setInteresesDisponibles(json.data)
      } catch {
        console.error("Error al cargar intereses")
      }
    }
    async function cargarEvento() {
      try {
        const sesionRaw = localStorage.getItem("agenda-lugar-sesion")
        if (!sesionRaw) return
        const sesion = JSON.parse(sesionRaw)

        const res = await fetch(`/api/eventos/${eventoId}`, {
          headers: { Authorization: `Bearer ${sesion.token}` },
        })
        const json = await res.json()
        if (!res.ok || !json.data) {
          setError(json.error || "Error al cargar evento")
          setCargandoEvento(false)
          return
        }

        const ev = json.data

        setTitulo(ev.titulo || "")
        setObjetivo(ev.objetivo || "")
        setPublicoObjetivo(ev.publicoObjetivo || "")
        setDescripcionItinerario(ev.descripcionItinerario || "")
        setObservaciones(ev.observaciones || "")

        const fi = new Date(ev.fechaInicio)
        setFechaInicio(fi.toISOString().split("T")[0])
        setHoraInicio(
          `${String(fi.getHours()).padStart(2, "0")}:${String(fi.getMinutes()).padStart(2, "0")}`
        )

        const ff = new Date(ev.fechaFin)
        setFechaFin(ff.toISOString().split("T")[0])
        setHoraFin(
          `${String(ff.getHours()).padStart(2, "0")}:${String(ff.getMinutes()).padStart(2, "0")}`
        )

        setCiudadId(ev.ciudadId || "")
        setLugarDireccion(ev.lugarDireccion || "")

        setEsGratuito(ev.esGratuito)
        setCostoEntrada(ev.costoEntrada != null ? String(ev.costoEntrada) : "")
        setUrlTicketeraExterna(ev.urlTicketeraExterna || "")

        if (ev.actividades) {
          setActividades(
            ev.actividades.map((a: Record<string, unknown>) => ({
              id: nuevoId(),
              nombre: (a.nombre as string) || "",
              descripcion: (a.descripcion as string) || "",
              horaInicio: (a.horaInicio as string)?.slice(0, 5) || "",
              horaFin: (a.horaFin as string)?.slice(0, 5) || "",
            }))
          )
        }

        if (ev.media) {
          setMediaList(
            ev.media.map((m: Record<string, unknown>) => ({
              id: nuevoId(),
              urlArchivo: (m.urlArchivo as string) || "",
              tipo: (m.tipo as "IMAGEN" | "VIDEO_EMBEDDED") || "IMAGEN",
            }))
          )
        }

        if (ev.participantes) {
          setParticipantes(
            ev.participantes.map((p: Record<string, unknown>) => ({
              id: nuevoId(),
              nombre: (p.nombre as string) || "",
              rolOPerfil: (p.rolOPerfil as string) || "",
            }))
          )
        }

        if (ev.patrocinadores) {
          setPatrocinadores(
            ev.patrocinadores.map((p: Record<string, unknown>) => ({
              id: nuevoId(),
              nombre: (p.nombre as string) || "",
              descripcion: (p.descripcion as string) || "",
              logoUrl: (p.logoUrl as string) || "",
              sitioWeb: (p.sitioWeb as string) || "",
            }))
          )
        }

        if (ev.intereses) {
          setInteresesSeleccionados(new Set(ev.intereses.map((i: Record<string, unknown>) => i.id as string)))
        }
      } catch {
        setError("Error de conexión al cargar evento")
      } finally {
        setCargandoEvento(false)
      }
    }
    cargarCiudades()
    cargarIntereses()
    cargarEvento()
  }, [eventoId])

  function toggleInteres(id: string) {
    setInteresesSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function agregarActividad() {
    setActividades((prev) => [
      ...prev,
      { id: nuevoId(), nombre: "", descripcion: "", horaInicio: "", horaFin: "" },
    ])
  }

  function actualizarActividad(id: number, campo: keyof ActividadItem, valor: string) {
    setActividades((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [campo]: valor } : a))
    )
  }

  function eliminarActividad(id: number) {
    setActividades((prev) => prev.filter((a) => a.id !== id))
  }

  function agregarMedia() {
    setMediaList((prev) => [
      ...prev,
      { id: nuevoId(), urlArchivo: "", tipo: "IMAGEN" },
    ])
  }

  function actualizarMedia(id: number, campo: keyof MediaItem, valor: string) {
    setMediaList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    )
  }

  function eliminarMedia(id: number) {
    setMediaList((prev) => prev.filter((m) => m.id !== id))
  }

  function agregarParticipante() {
    setParticipantes((prev) => [
      ...prev,
      { id: nuevoId(), nombre: "", rolOPerfil: "" },
    ])
  }

  function actualizarParticipante(id: number, campo: keyof ParticipanteItem, valor: string) {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    )
  }

  function eliminarParticipante(id: number) {
    setParticipantes((prev) => prev.filter((p) => p.id !== id))
  }

  function agregarPatrocinador() {
    setPatrocinadores((prev) => [
      ...prev,
      { id: nuevoId(), nombre: "", descripcion: "", logoUrl: "", sitioWeb: "" },
    ])
  }

  function actualizarPatrocinador(id: number, campo: keyof PatrocinadorItem, valor: string) {
    setPatrocinadores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    )
  }

  function eliminarPatrocinador(id: number) {
    setPatrocinadores((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEnviando(true)

    try {
      const sesionRaw = localStorage.getItem("agenda-lugar-sesion")
      if (!sesionRaw) {
        setError("Debes iniciar sesión para editar un evento")
        setEnviando(false)
        return
      }

      const sesion = JSON.parse(sesionRaw)
      const token = sesion.token

      const fechaInicioISO = new Date(`${fechaInicio}T${horaInicio || "00:00"}`).toISOString()
      const fechaFinISO = new Date(`${fechaFin}T${horaFin || "23:59"}`).toISOString()

      const body: Record<string, unknown> = {
        titulo,
        objetivo,
        publicoObjetivo,
        descripcionItinerario: descripcionItinerario || undefined,
        fechaInicio: fechaInicioISO,
        fechaFin: fechaFinISO,
        lugarDireccion,
        costoEntrada: esGratuito ? 0 : Number(costoEntrada),
        esGratuito,
        urlTicketeraExterna: urlTicketeraExterna || null,
        observaciones: observaciones || null,
        ciudadId,
        actividades: actividades.length > 0
          ? actividades.map((a) => ({
              nombre: a.nombre,
              descripcion: a.descripcion || undefined,
              horaInicio: a.horaInicio,
              horaFin: a.horaFin,
            }))
          : undefined,
        media: mediaList.length > 0
          ? mediaList.map((m) => ({
              urlArchivo: m.urlArchivo,
              tipo: m.tipo,
            }))
          : undefined,
        participantes: participantes.length > 0
          ? participantes.map((p) => ({
              nombre: p.nombre,
              rolOPerfil: p.rolOPerfil,
            }))
          : undefined,
        patrocinadores: patrocinadores.length > 0
          ? patrocinadores.map((p) => ({
              nombre: p.nombre,
              descripcion: p.descripcion || undefined,
              logoUrl: p.logoUrl || undefined,
              sitioWeb: p.sitioWeb || undefined,
            }))
          : undefined,
        interesesIds: interesesSeleccionados.size > 0
          ? Array.from(interesesSeleccionados)
          : undefined,
      }

      const res = await fetch(`/api/eventos/${eventoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Error al actualizar el evento")
        setEnviando(false)
        return
      }

      router.push(`/eventos/${eventoId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
      setEnviando(false)
    }
  }, [
    titulo, objetivo, publicoObjetivo, descripcionItinerario,
    fechaInicio, horaInicio, fechaFin, horaFin, lugarDireccion,
    costoEntrada, esGratuito, urlTicketeraExterna, observaciones,
    ciudadId, actividades, mediaList, participantes, patrocinadores,
    interesesSeleccionados, eventoId, router,
  ])

  if (cargandoEvento) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando datos del evento...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Sección 1 — Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              minLength={3}
              placeholder="Nombre del evento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo *</Label>
            <textarea
              id="objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
              className="h-20 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              placeholder="¿Cuál es el objetivo del evento?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publicoObjetivo">Público Objetivo *</Label>
            <Input
              id="publicoObjetivo"
              value={publicoObjetivo}
              onChange={(e) => setPublicoObjetivo(e.target.value)}
              required
              placeholder="Ej: Jóvenes, profesionales, familias..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcionItinerario">Descripción / Itinerario</Label>
            <textarea
              id="descripcionItinerario"
              value={descripcionItinerario}
              onChange={(e) => setDescripcionItinerario(e.target.value)}
              className="h-28 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              placeholder="Describe el itinerario o detalles del evento..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="h-20 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              placeholder="Información adicional..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección 2 — Fechas y Lugar */}
      <Card>
        <CardHeader>
          <CardTitle>Fechas y Lugar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora Inicio</Label>
              <Input
                id="horaInicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin *</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFin">Hora Fin</Label>
              <Input
                id="horaFin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudadId">Ciudad *</Label>
            <select
              id="ciudadId"
              value={ciudadId}
              onChange={(e) => setCiudadId(e.target.value)}
              required
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="">Selecciona una ciudad</option>
              {ciudades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lugarDireccion">Lugar / Dirección *</Label>
            <Input
              id="lugarDireccion"
              value={lugarDireccion}
              onChange={(e) => setLugarDireccion(e.target.value)}
              required
              placeholder="Dirección del evento"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección 3 — Costo */}
      <Card>
        <CardHeader>
          <CardTitle>Costo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="esGratuito"
              type="checkbox"
              checked={esGratuito}
              onChange={(e) => setEsGratuito(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="esGratuito">Es gratuito</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="costoEntrada">
              Costo de Entrada {!esGratuito && "*"}
            </Label>
            <Input
              id="costoEntrada"
              type="number"
              min="0"
              step="0.01"
              value={costoEntrada}
              onChange={(e) => setCostoEntrada(e.target.value)}
              disabled={esGratuito}
              required={!esGratuito}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="urlTicketeraExterna">URL Ticketera Externa</Label>
            <Input
              id="urlTicketeraExterna"
              type="url"
              value={urlTicketeraExterna}
              onChange={(e) => setUrlTicketeraExterna(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección 4 — Actividades */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actividades.map((actividad) => (
            <div key={actividad.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Actividad</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarActividad(actividad.id)}
                >
                  Eliminar
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={actividad.nombre}
                  onChange={(e) => actualizarActividad(actividad.id, "nombre", e.target.value)}
                  placeholder="Nombre de la actividad"
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={actividad.descripcion}
                  onChange={(e) => actualizarActividad(actividad.id, "descripcion", e.target.value)}
                  placeholder="Descripción opcional"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Hora Inicio</Label>
                  <Input
                    type="time"
                    value={actividad.horaInicio}
                    onChange={(e) => actualizarActividad(actividad.id, "horaInicio", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora Fin</Label>
                  <Input
                    type="time"
                    value={actividad.horaFin}
                    onChange={(e) => actualizarActividad(actividad.id, "horaFin", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={agregarActividad}>
            + Agregar Actividad
          </Button>
        </CardContent>
      </Card>

      {/* Sección 5 — Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediaList.map((m) => (
            <div key={m.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Media</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarMedia(m.id)}
                >
                  Eliminar
                </Button>
              </div>
              <div className="space-y-2">
                <Label>URL del Archivo</Label>
                <Input
                  value={m.urlArchivo}
                  onChange={(e) => actualizarMedia(m.id, "urlArchivo", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={m.tipo}
                  onChange={(e) => actualizarMedia(m.id, "tipo", e.target.value as "IMAGEN" | "VIDEO_EMBEDDED")}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="IMAGEN">Imagen</option>
                  <option value="VIDEO_EMBEDDED">Video Embebido</option>
                </select>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={agregarMedia}>
            + Agregar Media
          </Button>
        </CardContent>
      </Card>

      {/* Sección 6 — Participantes */}
      <Card>
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {participantes.map((p) => (
            <div key={p.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Participante</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarParticipante(p.id)}
                >
                  Eliminar
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={p.nombre}
                  onChange={(e) => actualizarParticipante(p.id, "nombre", e.target.value)}
                  placeholder="Nombre del participante"
                />
              </div>
              <div className="space-y-2">
                <Label>Rol / Perfil</Label>
                <Input
                  value={p.rolOPerfil}
                  onChange={(e) => actualizarParticipante(p.id, "rolOPerfil", e.target.value)}
                  placeholder="Ej: Ponente, Coordinador..."
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={agregarParticipante}>
            + Agregar Participante
          </Button>
        </CardContent>
      </Card>

      {/* Sección 7 — Patrocinadores */}
      <Card>
        <CardHeader>
          <CardTitle>Patrocinadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patrocinadores.map((p) => (
            <div key={p.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Patrocinador</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarPatrocinador(p.id)}
                >
                  Eliminar
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={p.nombre}
                  onChange={(e) => actualizarPatrocinador(p.id, "nombre", e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={p.descripcion}
                  onChange={(e) => actualizarPatrocinador(p.id, "descripcion", e.target.value)}
                  placeholder="Descripción opcional"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  type="url"
                  value={p.logoUrl}
                  onChange={(e) => actualizarPatrocinador(p.id, "logoUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Sitio Web</Label>
                <Input
                  type="url"
                  value={p.sitioWeb}
                  onChange={(e) => actualizarPatrocinador(p.id, "sitioWeb", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={agregarPatrocinador}>
            + Agregar Patrocinador
          </Button>
        </CardContent>
      </Card>

      {/* Sección 8 — Intereses */}
      <Card>
        <CardHeader>
          <CardTitle>Intereses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {interesesDisponibles.map((interes) => (
              <label
                key={interes.id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm has-checked:border-primary has-checked:bg-primary/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={interesesSeleccionados.has(interes.id)}
                  onChange={() => toggleInteres(interes.id)}
                  className="size-4"
                />
                {interes.nombre}
              </label>
            ))}
            {interesesDisponibles.length === 0 && (
              <p className="text-sm text-muted-foreground">Cargando intereses...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón de envío */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando} size="lg">
          {enviando ? "Guardando cambios..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}
