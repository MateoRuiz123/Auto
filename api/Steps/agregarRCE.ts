import { AfterStep, Given, Then, When } from "@cucumber/cucumber";
import { APIResponse, expect } from "@playwright/test";
import PeticionTipificacion from "../endpoint/ServicioDeTipificacion/Tipificacion_Request";
import { BodyTipificacion } from "../endpoint/ServicioDeTipificacion/Tipificacion_Body";
import BodyAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_body";
import PeticionCrearAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_request";
import BodyAutorizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Body";
import PeticionCrearAutotizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Request";
import Database from "../commons/database_manager";
import { BodyLogin } from "../endpoint/ServicioDeAutenticacion/ServicioDeAutenticacion_Body";

const bodyTipificacion = new BodyTipificacion();
const PeticionModificarValor = new PeticionTipificacion();
const bodyAsignar = new BodyAsignacion();
const peticionAsignar = new PeticionCrearAsignacion();
const bodyAuth = new BodyAutorizacion();
const peticionAuth = new PeticionCrearAutotizacion();
const db = Database.getInstance();

let respuesta: APIResponse, resAsignar: APIResponse, resAuth: APIResponse;
export const login = new BodyLogin();
Given(`Agregar que soy un usuario de GDE tipificado con codigo_remision {string} {string} {string}`, (cp: string, user: string, pass: string) => {
    // [Given] Sets up the initial state of the system.
    console.log(cp)
    login.cambioUsuarioYcontrasena(user, pass);
});

When(`Agregar en la api cambio de valor de GDE, envio una guia con nivel de servicio uno estado diferente a recibir por coordinadora, antes de autorizar a carga de trabajo, con el campo valor mayor que cero {string} {int} {int}`, (codigo_remision: string, valor: number, autorizada: number) => {
    // [When] Describes the action or event that triggers the scenario.
    setTimeout(async () => {
        const consultaRemision = await db.getIdRemision(codigo_remision);
        const consultaNivelServicio = await db.getNivelServicio(consultaRemision.rows[0].id_remision);
        const nivel_servicio = await consultaNivelServicio.rows[0].nivel_servicio;
        const asignarEtiqueta1d = "7" + codigo_remision + "001";
        const asignarEtiqueta2d = "700100102000000000" + codigo_remision + asignarEtiqueta1d.slice(-3);
        const asignarReferenciaDetalle = codigo_remision + "." + asignarEtiqueta1d.slice(-3).replace(/^0+/, "");
        const asignarNombreEquipo = "[19] CC San Diego";
        const asignarVinculoEquipo = 2;
        const asignarTerminalDispositivo = 2;
        const asignarTerminalNominaEmpleado = 2;
        const asignarIdPeticion = Math.floor(10000 + Math.random() * 90000);
        switch (autorizada) {
            case 0: // 0 = Sin Asignar -> orden: asignar, modificar
                console.log('\x1b[46m\x1b[37mNo se autoriza la carga de trabajo, solo ASIGNACIÓN\x1b[0m');
                bodyAsignar.CambiarGuia(codigo_remision);
                bodyAsignar.CambiarEtiqueta1D(asignarEtiqueta1d);
                bodyAsignar.CambiarEtiqueta2D(asignarEtiqueta2d);
                bodyAsignar.CambiarReferenciaDetalle(asignarReferenciaDetalle);
                bodyAsignar.CambiarNombreEquipo(asignarNombreEquipo);
                bodyAsignar.CambiarVinculoEquipo(asignarVinculoEquipo);
                bodyAsignar.CambiarTerminalDispositivo(asignarTerminalDispositivo);
                bodyAsignar.CambiarTerminalNominaEmpleado(asignarTerminalNominaEmpleado);
                bodyAsignar.CambiarIDPeticion(asignarIdPeticion);

                bodyTipificacion.CambiarCodigoRemison(codigo_remision);
                bodyTipificacion.CambiarValor(valor);

                console.log(bodyAsignar.toJSON());
                console.log(bodyTipificacion.toJSON());
                console.log(login.toJSON());

                resAsignar = await peticionAsignar.crearAsignacion(bodyAsignar.toJSON());
                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );

                console.log(await resAsignar.json(), "respuesta de asignar");
                console.log(await respuesta.json(), "respuesta");
                break;
            case 1: // 1 = Asignado -> orden: asignar, autorizar, modificar
                console.log('\x1b[42m\x1b[37mSe autoriza la carga de trabajo\x1b[0m');

                bodyAsignar.CambiarGuia(codigo_remision);
                bodyAsignar.CambiarEtiqueta1D(asignarEtiqueta1d);
                bodyAsignar.CambiarEtiqueta2D(asignarEtiqueta2d);
                bodyAsignar.CambiarReferenciaDetalle(asignarReferenciaDetalle);
                bodyAsignar.CambiarNombreEquipo(asignarNombreEquipo);
                bodyAsignar.CambiarVinculoEquipo(asignarVinculoEquipo);
                bodyAsignar.CambiarTerminalDispositivo(asignarTerminalDispositivo);
                bodyAsignar.CambiarTerminalNominaEmpleado(asignarTerminalNominaEmpleado);
                bodyAsignar.CambiarIDPeticion(asignarIdPeticion);

                bodyAuth.CambiarCodigoRemision(codigo_remision);
                bodyAuth.CambiarFechaHora(new Date());
                bodyAuth.CambiarCodigoNivelServio(nivel_servicio);

                bodyTipificacion.CambiarCodigoRemison(codigo_remision);
                bodyTipificacion.CambiarValor(valor);

                console.log(bodyAsignar.toJSON());
                console.log(bodyAuth.toJSON());
                console.log(bodyTipificacion.toJSON());
                console.log(login.toJSON());

                resAsignar = await peticionAsignar.crearAsignacion(bodyAsignar.toJSON());
                resAuth = await peticionAuth.crearAutorizacion(bodyAuth.toJSON());
                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );

                console.log(await resAsignar.json(), "respuesta de asignar");
                console.log(await resAuth.json(), "respuesta de autorizar");
                console.log(await respuesta.json(), "respuesta");
                break;
            case 2: // 2 = RCE Anulado -> orden: modificar, asignar, autorizar, modificar con valor en 0
                console.log('\x1b[41m\x1b[37mSe anula el RCE\x1b[0m');

                bodyTipificacion.CambiarCodigoRemison(codigo_remision);
                bodyTipificacion.CambiarValor(valor);

                bodyAsignar.CambiarGuia(codigo_remision);
                bodyAsignar.CambiarEtiqueta1D(asignarEtiqueta1d);
                bodyAsignar.CambiarEtiqueta2D(asignarEtiqueta2d);
                bodyAsignar.CambiarReferenciaDetalle(asignarReferenciaDetalle);
                bodyAsignar.CambiarNombreEquipo(asignarNombreEquipo);
                bodyAsignar.CambiarVinculoEquipo(asignarVinculoEquipo);
                bodyAsignar.CambiarTerminalDispositivo(asignarTerminalDispositivo);
                bodyAsignar.CambiarTerminalNominaEmpleado(asignarTerminalNominaEmpleado);
                bodyAsignar.CambiarIDPeticion(asignarIdPeticion);

                bodyAuth.CambiarCodigoRemision(codigo_remision);
                bodyAuth.CambiarFechaHora(new Date());
                bodyAuth.CambiarCodigoNivelServio(nivel_servicio);

                console.log(bodyTipificacion.toJSON());
                console.log(bodyAsignar.toJSON());
                console.log(bodyAuth.toJSON());
                console.log(login.toJSON());

                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );
                console.log(await respuesta.json(), "respuesta con NS 22");
                resAsignar = await peticionAsignar.crearAsignacion(bodyAsignar.toJSON());
                resAuth = await peticionAuth.crearAutorizacion(bodyAuth.toJSON());

                bodyTipificacion.CambiarValor(0);
                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );
                console.log(await resAsignar.json(), "respuesta de asignar");
                console.log(await resAuth.json(), "respuesta de autorizar");
                console.log(await respuesta.json(), "respuesta con RCE ANULADO");

                break;
            default:
                console.log('\x1b[41m\x1b[37mDato erroneo - No se autoriza la carga de trabajo\x1b[0m');
                break;
        }
    }, 2000);
}
);
AfterStep(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
});
Then(`Agregar se realiza el respectivo proceso de agregar el registro del recaudo en la tabla recaudos registro de la guia en dicha tabla dejando el campo valor_total con el calor enviado en el campo valor del body de la Api, se cambia el nivel de servicio uno a veintidos en la tabla remesas_niveles_servicio campo nivel_servicio y se modifica la guia en la tabla generacion_rotulos cambiando el campo codigo_nivel_servicio por veintidos, el campo nivel_servicio por Recaudos Contra Entrega y el campo recaudo por el valor a recaudar enviado en el campo valor del body de la Api, estas tres tablas pertenecientes a la base de datos CM Testing ciento veinte a su vez se inserta la guia en la coleccion llamada cambios_valor_agw del proyecto cm_guias_test de firestore, con el campo llamado estado igual a pendiente y cuando el reloj marque un minuto terminado en cero o en cinco, se correra una tarea que realizara la insercion del registro de la guia en la tabla agw_recaudos con el campo campo valor de esa tabla igual al valor enviando en el campo valor del body de la Api, se modifica el nivel de servicio en la tabla agw_remisiones_niveles_servicio dejando el nivel de servicio veintidos en el campo nivel_servicio, estas dos tablas pertenecientes a la base de datos de sandbox_agw reflejando por ultimo una respuesta de con el estado Recaudo insertado, el valorAnterior del RCE y el Valor Nuevo Si el cliente esta tipificado codigo_remision devuelve el campo codigoRemision con el numero de guia y los campos referencia y referenciaDetalle vacios, si el cliente es tipificado referencia devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia de la guia la cual se envia en el body de la api, y el campo referenciaDetalle vacio, si el cliente es tipificado referencia y referenciaDetalle devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia que se envia en el body de la api, y el campo referenciaDetalle con la referenciaDetalle que se envia en el body de la api {string} {int}`, async (res: string, status: number) => {
    // [Then] Describes the expected outcome or result of the scenario.
    expect(respuesta.status()).toBe(status);
    expect(resAsignar.status()).toBe(status);
    const responseData = await respuesta.json();
    expect(responseData.isError).toBe(false);
    expect(responseData.data.estado.toLowerCase()).toMatch(/(recaudo insertado|recaudo eliminado)/);
});