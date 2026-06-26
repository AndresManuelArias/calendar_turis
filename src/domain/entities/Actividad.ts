export class Actividad {
  private _id: string;
  private _nombre: string;
  private _descripcion: string;
  private _horaInicio: Date;
  private _horaFin: Date;
  private _eventoId: string;

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    horaInicio: Date,
    horaFin: Date,
    eventoId: string
  ) {
    this._id = id;
    this._nombre = nombre;
    this._descripcion = descripcion;
    this._horaInicio = horaInicio;
    this._horaFin = horaFin;
    this._eventoId = eventoId;
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  get horaInicio(): Date {
    return this._horaInicio;
  }

  get horaFin(): Date {
    return this._horaFin;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
