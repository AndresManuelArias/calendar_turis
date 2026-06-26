export class Ciudad {
  private _id: string;
  private _nombre: string;
  private _codigoRegion: string;

  constructor(id: string, nombre: string, codigoRegion: string) {
    this._id = id;
    this._nombre = nombre;
    this._codigoRegion = codigoRegion;
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
}
