import { TipoMedia } from "../enums/TipoMedia";

export class Media {
  private _id: string;
  private _urlArchivo: string;
  private _tipo: TipoMedia;
  private _eventoId: string;

  constructor(
    id: string,
    urlArchivo: string,
    tipo: TipoMedia,
    eventoId: string
  ) {
    this._id = id;
    this._urlArchivo = urlArchivo;
    this._tipo = tipo;
    this._eventoId = eventoId;
  }

  get id(): string {
    return this._id;
  }

  get urlArchivo(): string {
    return this._urlArchivo;
  }

  get tipo(): TipoMedia {
    return this._tipo;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
