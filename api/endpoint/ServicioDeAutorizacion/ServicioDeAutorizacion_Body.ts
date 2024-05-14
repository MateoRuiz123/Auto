export interface ServicioDeAutorizacionInterface {
    terminal: number,
    equipo: {
        codigo_equipo: string,
        id_categoria: number,
        categoria: string,
    },
    usuario: string,
    fecha_hora_autorizacion: Date,
    guias: [
        {
            codigo_nivel_servicio: number,
            codigo_producto: number,
            codigo_remision: string,
            factura: string,
            flag_alerta: boolean,
            flag_entregada: boolean,
            flag_factura: boolean,
            flag_desautorizada: boolean,
            incompleta: boolean,
            nivel_servicio: boolean,
            peso: number,
            tipo_cuenta: number,
            nombre_cuenta: string,
            total_unidades: number,
            volumen: number,
            id_chp_origen: number
        }
    ],
    autorizacion_forzada: boolean
}

export default class BodyAutorizacion {
    private BodyAuth: ServicioDeAutorizacionInterface;
    constructor() {
        this.BodyAuth = {
            terminal: 2,
            equipo: {
                codigo_equipo: "12",
                id_categoria: 1,
                categoria: "Distribución"
            },
            usuario: "PruebasAutomatizacion",
            fecha_hora_autorizacion: new Date(), // Modificar
            guias: [
                {
                    codigo_nivel_servicio: 0, // Modificar
                    codigo_producto: 1,
                    codigo_remision: "", // Modificar
                    factura: "",
                    flag_alerta: false,
                    flag_entregada: false,
                    flag_factura: false,
                    flag_desautorizada: false,
                    incompleta: false,
                    nivel_servicio: true,
                    peso: 75,
                    tipo_cuenta: 1,
                    nombre_cuenta: "CC",
                    total_unidades: 1,
                    volumen: 4,
                    id_chp_origen: 12
                }
            ],
            autorizacion_forzada: true
        }
    }
    toJSON() {
        return JSON.stringify(this.BodyAuth);
    }
    CambiarFechaHora(fecha: Date) {
        this.BodyAuth.fecha_hora_autorizacion = fecha;
    }
    CambiarCodigoNivelServio(codigo: number) {
        this.BodyAuth.guias[0].codigo_nivel_servicio = codigo;
    }
    CambiarCodigoRemision(codigoRemision: string) {
        this.BodyAuth.guias[0].codigo_remision = codigoRemision;
    }
}