export interface TipificacionInterface {
  codigoRemision: string;
  referencia: string;
  referenciaDetalle: string[];
  valor: number;
  debug: boolean;
}

export class BodyTipificacion {
  private BodyTipificacionCoordinadoraCodigoRemision: TipificacionInterface;
  constructor() {
    this.BodyTipificacionCoordinadoraCodigoRemision = {
      codigoRemision: "",
      referencia: "",
      referenciaDetalle: [],
      valor: 54322,
      debug: false,
    };
  }
  toJSON(): string {
    return JSON.stringify(this.BodyTipificacionCoordinadoraCodigoRemision);
  }
  CambiarCodigoRemison(codigoRemision: string) {
    this.BodyTipificacionCoordinadoraCodigoRemision.codigoRemision =
      codigoRemision;
  }
  CambiarReferencia(referencia: string) {
    this.BodyTipificacionCoordinadoraCodigoRemision.referencia = referencia;
  }
  CambiarReferenciaDetalle(referenciaDetalle: string[]) {
    this.BodyTipificacionCoordinadoraCodigoRemision.referenciaDetalle =
      referenciaDetalle;
  }
  CambiarValor(valor: number) {
    this.BodyTipificacionCoordinadoraCodigoRemision.valor = valor;
  }
  CambiarDebug(debug: boolean) {
    this.BodyTipificacionCoordinadoraCodigoRemision.debug = debug;
  }
}
