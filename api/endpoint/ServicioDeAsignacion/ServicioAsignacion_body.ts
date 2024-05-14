export interface ServicioAsignacionInterface {
  guias: {
    guia: string;
    unidades: {
      referencia: string;
      etiqueta1d: string;
      etiqueta2d: string;
      referencia_detalle: string;
      fecha_hora_lectura: string;
    }[];
  }[];
  unidades_reconstruccion: {
    lectura: string;
    tipo_lectura: string;
    fecha_hora_lectura: string;
  }[];
  movil: string;
  trailer: string;
  dispositivo: string;
  equipo: string;
  nombre_equipo: string;
  codigo_repartidor: number;
  codigo_asignador: number;
  nombre_asignador: string;
  numero_entrega: string;
  id_ruta: string;
  estructura_equipo: number;
  vinculo_equipo: number;
  terminal_dispositivo: number;
  terminal_nomina_empleado: number;
  codigo_empleado: number;
  nombre_empleado: string;
  nombre_repartidor: string;
  id_accion_checkpoint: number;
  nombre_accion_checkpoint: string;
  muelle: string;
  latitud: string;
  longitud: string;
  id_peticion: number;
}

export default class BodyAsignacion {
  private BodyAsignacion: ServicioAsignacionInterface;
  constructor() {
    this.BodyAsignacion = {
      guias: [
        {
          guia: "", // Modificar
          unidades: [
            {
              referencia: "",
              etiqueta1d: "", // Modificar
              etiqueta2d: "", // Modificar
              referencia_detalle: "", // Modificar
              fecha_hora_lectura: "",
            },
          ],
        },
      ],
      unidades_reconstruccion: [
        {
          lectura: "70010010200026314673940710290005",
          tipo_lectura: "2",
          fecha_hora_lectura: "",
        },
      ],
      movil: "12345",
      trailer: "Prueba12345",
      dispositivo: "19045521400550",
      equipo: "88",
      nombre_equipo: "", // Modificar
      codigo_repartidor: 2504,
      codigo_asignador: 2504,
      nombre_asignador: "PRUEBAS AUTOMATIZADAS TS",
      numero_entrega: "0",
      id_ruta: "ul0OVNm54EWjCjcH7d2S",
      estructura_equipo: 1,
      vinculo_equipo: 0, // Modificar
      terminal_dispositivo: 0, // Modificar
      terminal_nomina_empleado: 0, // Modificar
      codigo_empleado: 2504,
      nombre_empleado: "PRUEBAS",
      nombre_repartidor: "Usuario 44",
      id_accion_checkpoint: 12,
      nombre_accion_checkpoint: "Checkpoint Asignación",
      muelle: "124",
      latitud: "0.0",
      longitud: "0.0",
      id_peticion: 0, // Modificar
    };
  }
  toJSON(): string {
    return JSON.stringify(this.BodyAsignacion);
  }
  CambiarGuia(guia: string) {
    this.BodyAsignacion.guias[0].guia = guia;
  }
  CambiarReferencia(referencia: string) {
    this.BodyAsignacion.guias[0].unidades[0].referencia = referencia;
  }
  CambiarEtiqueta1D(etiqueta1d: string) {
    this.BodyAsignacion.guias[0].unidades[0].etiqueta1d = etiqueta1d;
  }
  CambiarEtiqueta2D(etiqueta2d: string) {
    this.BodyAsignacion.guias[0].unidades[0].etiqueta2d = etiqueta2d;
  }
  CambiarReferenciaDetalle(referencia_detalle: string) {
    this.BodyAsignacion.guias[0].unidades[0].referencia_detalle =
      referencia_detalle;
  }
  CambiarNombreEquipo(nombre_equipo: string) {
    this.BodyAsignacion.nombre_equipo = nombre_equipo;
  }
  CambiarVinculoEquipo(vinculo_equipo: number) {
    this.BodyAsignacion.vinculo_equipo = vinculo_equipo;
  }
  CambiarTerminalDispositivo(terminal_dispositivo: number) {
    this.BodyAsignacion.terminal_dispositivo = terminal_dispositivo;
  }
  CambiarTerminalNominaEmpleado(terminal_nomina_empleado: number) {
    this.BodyAsignacion.terminal_nomina_empleado = terminal_nomina_empleado;
  }
  CambiarIDPeticion(id_peticion: number) {
    this.BodyAsignacion.id_peticion = id_peticion;
  }
}