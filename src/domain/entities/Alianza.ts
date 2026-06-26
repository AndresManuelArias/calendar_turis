export class Alianza {
  private _id: string;
  private _nombreInstitucion: string;
  private _tipoConvenio: string;
  private _eventoId: string;

  constructor(
    id: string,
    nombreInstitucion: string,
    tipoConvenio: string,
    eventoId: string
  ) {
    this._id = id;
    this._nombreInstitucion = nombreInstitucion;
    this._tipoConvenio = tipoConvenio;
    this._eventoId = eventoId;
  }

  get id(): string {
    return this._id;
  }

  get nombreInstitucion(): string {
    return this._nombreInstitucion;
  }

  get tipoConvenio(): string {
    return this._tipoConvenio;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
