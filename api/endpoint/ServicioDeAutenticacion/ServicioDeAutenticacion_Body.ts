export interface LoginInterfaces {
  usuario: string;
  clave: string;
}

export class BodyLogin {
  private body_login: LoginInterfaces;
  constructor() {
    this.body_login = {
      usuario: "",
      clave: "",
    };
  }
  toJSON(): string {
    return JSON.stringify(this.body_login);
  }

  cambioUsuarioYcontraseña(usuario: string, clave: string) {
    this.body_login.usuario = usuario;
    this.body_login.clave = clave;
  }
}
