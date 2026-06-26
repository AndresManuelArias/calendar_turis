export class Evento {
  private _id: string;
  private _titulo: string;
  private _objetivo: string;
  private _publicoObjetivo: string;
  private _descripcionItinerario: string;
  private _fechaInicio: Date;
  private _fechaFin: Date;
  private _lugarDireccion: string;
  private _costoEntrada: number;
  private _esGratuito: boolean;
  private _urlTicketeraExterna: string;
  private _observaciones: string;
  private _ciudadId: string;
  private _organizadorId: string;

  constructor(
    id: string,
    titulo: string,
    objetivo: string,
    publicoObjetivo: string,
    descripcionItinerario: string,
    fechaInicio: Date,
    fechaFin: Date,
    lugarDireccion: string,
    costoEntrada: number,
    esGratuito: boolean,
    urlTicketeraExterna: string,
    observaciones: string,
    ciudadId: string,
    organizadorId: string
  ) {
    this._id = id;
    this._titulo = titulo;
    this._objetivo = objetivo;
    this._publicoObjetivo = publicoObjetivo;
    this._descripcionItinerario = descripcionItinerario;
    this._fechaInicio = fechaInicio;
    this._fechaFin = fechaFin;
    this._lugarDireccion = lugarDireccion;
    this._costoEntrada = costoEntrada;
    this._esGratuito = esGratuito;
    this._urlTicketeraExterna = urlTicketeraExterna;
    this._observaciones = observaciones;
    this._ciudadId = ciudadId;
    this._organizadorId = organizadorId;
  }

  get id(): string {
    return this._id;
  }

  get titulo(): string {
    return this._titulo;
  }

  get objetivo(): string {
    return this._objetivo;
  }

  get publicoObjetivo(): string {
    return this._publicoObjetivo;
  }

  get descripcionItinerario(): string {
    return this._descripcionItinerario;
  }

  get fechaInicio(): Date {
    return this._fechaInicio;
  }

  get fechaFin(): Date {
    return this._fechaFin;
  }

  get lugarDireccion(): string {
    return this._lugarDireccion;
  }

  get costoEntrada(): number {
    return this._costoEntrada;
  }

  get esGratuito(): boolean {
    return this._esGratuito;
  }

  get urlTicketeraExterna(): string {
    return this._urlTicketeraExterna;
  }

  get observaciones(): string {
    return this._observaciones;
  }

  get ciudadId(): string {
    return this._ciudadId;
  }

  get organizadorId(): string {
    return this._organizadorId;
  }

  esHoy(): boolean {
    const ahora = new Date();
    return (
      this._fechaInicio.getFullYear() === ahora.getFullYear() &&
      this._fechaInicio.getMonth() === ahora.getMonth() &&
      this._fechaInicio.getDate() === ahora.getDate()
    );
  }

  estaActivo(): boolean {
    const ahora = new Date();
    return ahora >= this._fechaInicio && ahora <= this._fechaFin;
  }

  diasRestantes(): number {
    const ahora = new Date();
    const diffMs = this._fechaInicio.getTime() - ahora.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}
