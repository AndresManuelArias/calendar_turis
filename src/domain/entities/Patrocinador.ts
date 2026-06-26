export class Patrocinador {
  private _id: string;
  private _nombreEmpresa: string;
  private _urlLogo: string;
  private _nivelPatrocinio: string;
  private _eventoId: string;

  constructor(
    id: string,
    nombreEmpresa: string,
    urlLogo: string,
    nivelPatrocinio: string,
    eventoId: string
  ) {
    this._id = id;
    this._nombreEmpresa = nombreEmpresa;
    this._urlLogo = urlLogo;
    this._nivelPatrocinio = nivelPatrocinio;
    this._eventoId = eventoId;
  }

  get id(): string {
    return this._id;
  }

  get nombreEmpresa(): string {
    return this._nombreEmpresa;
  }

  get urlLogo(): string {
    return this._urlLogo;
  }

  get nivelPatrocinio(): string {
    return this._nivelPatrocinio;
  }

  get eventoId(): string {
    return this._eventoId;
  }
}
