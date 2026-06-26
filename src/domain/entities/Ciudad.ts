export class Ciudad {
  private _id: string;
  private _nombre: string;
  private _codigoRegion: string;
  private _pais: string;

  constructor(id: string, nombre: string, codigoRegion: string, pais: string = "Colombia") {
    this._id = id;
    this._nombre = nombre;
    this._codigoRegion = codigoRegion;
    this._pais = pais;
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get codigoRegion(): string {
    return this._codigoRegion;
  }

  get pais(): string {
    return this._pais;
  }
}
