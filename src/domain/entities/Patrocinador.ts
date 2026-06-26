export class Patrocinador {
  private _id: string;
  private _nombre: string;
  private _descripcion: string;
  private _logoUrl: string;
  private _sitioWeb: string;
  private _eventoId: string;

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    logoUrl: string,
    sitioWeb: string,
    eventoId: string
  ) {
    this._id = id;
    this._nombre = nombre;
    this._descripcion = descripcion;
    this._logoUrl = logoUrl;
    this._sitioWeb = sitioWeb;
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

  get logoUrl(): string {
    return this._logoUrl;
  }

  get sitioWeb(): string {
    return this._sitioWeb;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
