export class Ciudad {
  private _id: string;
  private _nombre: string;
  private _estado: string;
  private _pais: string;

  constructor(id: string, nombre: string, estado: string, pais: string = "Colombia") {
    this._id = id;
    this._nombre = nombre;
    this._estado = estado;
    this._pais = pais;
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get estado(): string {
    return this._estado;
  }

  get pais(): string {
    return this._pais;
  }
}
