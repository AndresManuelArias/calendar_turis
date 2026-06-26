export class Participante {
  private _id: string;
  private _nombre: string;
  private _rolOPerfil: string;
  private _eventoId: string;

  constructor(
    id: string,
    nombre: string,
    rolOPerfil: string,
    eventoId: string
  ) {
    this._id = id;
    this._nombre = nombre;
    this._rolOPerfil = rolOPerfil;
    this._eventoId = eventoId;
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get rolOPerfil(): string {
    return this._rolOPerfil;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
