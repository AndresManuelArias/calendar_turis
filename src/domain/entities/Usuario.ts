export class Usuario {
  private _id: string;
  private _nombre: string;
  private _email: string;
  private _contraseniaHash: string;
  private _fechaRegistro: Date;

  constructor(
    id: string,
    nombre: string,
    email: string,
    contraseniaHash: string,
    fechaRegistro: Date
  ) {
    this._id = id;
    this._nombre = nombre;
    this._email = email;
    this._contraseniaHash = contraseniaHash;
    this._fechaRegistro = fechaRegistro;
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get email(): string {
    return this._email;
  }

  get contraseniaHash(): string {
    return this._contraseniaHash;
  }

  get fechaRegistro(): Date {
    return this._fechaRegistro;
  }

  registrarse(): boolean {
    return this._nombre.length > 0 && this._email.includes("@") && this._contraseniaHash.length > 0;
  }

  iniciarSesion(contrasenia: string): boolean {
    return this._contraseniaHash === contrasenia;
  }
}
