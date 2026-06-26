export class Interes {
  private _id: string;
  private _nombre: string;
  private _descripcion: string;

  constructor(id: string, nombre: string, descripcion: string) {
    this._id = id;
    this._nombre = nombre;
    this._descripcion = descripcion;
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
}
