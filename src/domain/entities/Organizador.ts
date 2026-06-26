import { Usuario } from "./Usuario";

export class Organizador extends Usuario {
  private _nitORut: string;
  private _telefonoContacto: string;
  private _sitioWeb: string;

  constructor(
    id: string,
    nombre: string,
    email: string,
    contraseniaHash: string,
    fechaRegistro: Date,
    nitORut: string,
    telefonoContacto: string,
    sitioWeb: string
  ) {
    super(id, nombre, email, contraseniaHash, fechaRegistro);
    this._nitORut = nitORut;
    this._telefonoContacto = telefonoContacto;
    this._sitioWeb = sitioWeb;
  }

  get nitORut(): string {
    return this._nitORut;
  }

  get telefonoContacto(): string {
    return this._telefonoContacto;
  }

  get sitioWeb(): string {
    return this._sitioWeb;
  }
}
