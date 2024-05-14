import {Given, Then, When} from '@cucumber/cucumber';
import {APIResponse, expect} from 'playwright/test';
import {BodyLogin} from "../endpoint/ServicioDeAutenticacion/ServicioDeAutenticacion_Body";
import Database from "../commons/database_manager";
import {BodyTipificacion} from "../endpoint/ServicioDeTipificacion/Tipificacion_Body";
import PeticionTipificacion from "../endpoint/ServicioDeTipificacion/Tipificacion_Request";
import BodyAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_body";
import PeticionCrearAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_request";
import BodyAutorizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Body";
import PeticionCrearAutotizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Request";

export const login = new BodyLogin();
const db = new Database();

const bodyTipificacion = new BodyTipificacion()
const PeticionModificarValor =
    new PeticionTipificacion();
const BodyAntesDeAutorizar = new BodyAsignacion();
const PeticionAntesDeAutorizar = new PeticionCrearAsignacion();

const BodyAuth = new BodyAutorizacion();
const PeticionAuth = new PeticionCrearAutotizacion();

let respuesta: APIResponse;
let resAsignar: APIResponse;
let resAuth: APIResponse;

Given(`que soy un usuario de GDE tipificado con referencia y referencia_detalle {string} {string} {string}`, (cp: string, user: string, pass: string) => {
    // [Given] Sets up the initial state of the system.
    console.log(cp)
    login.cambioUsuarioYcontrasena(user, pass);
});

When(`en la api cambio de valor de GDE, envio una referencia y referencia_detalle pertenecientes a una guia con nivel de servicio veintidos estado diferente a recibir por coordinadora, antes de autorizar a carga de trabajo, con el campo valor mayor que cero {string} {string} {int} {int}`, async (referencia: string, referencia_detalle: string, valor: number, autorizada: number) => {
    // [When] Describes the action or event that triggers the scenario.
    setTimeout(async () => {
        const getCodigoRemision = await db.getNivelServicioByReferenciaYReferenciaDetalle(referencia, [referencia_detalle]);
        console.log(getCodigoRemision.rows[0].codigo_remision, '***************************');
        const codigo_remision = getCodigoRemision.rows[0].codigo_remision;
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
            case 1: // Api orden -> asignas, modificas y autorizas
                console.log('\x1b[42m\x1b[37mSe autoriza la carga de trabajo\x1b[0m');

                BodyAntesDeAutorizar.CambiarGuia(codigo_remision);
                BodyAntesDeAutorizar.CambiarEtiqueta1D(asignarEtiqueta1d);
                BodyAntesDeAutorizar.CambiarEtiqueta2D(asignarEtiqueta2d);
                BodyAntesDeAutorizar.CambiarReferenciaDetalle(asignarReferenciaDetalle);
                BodyAntesDeAutorizar.CambiarNombreEquipo(asignarNombreEquipo);
                BodyAntesDeAutorizar.CambiarVinculoEquipo(asignarVinculoEquipo);
                BodyAntesDeAutorizar.CambiarTerminalDispositivo(asignarTerminalDispositivo);
                BodyAntesDeAutorizar.CambiarTerminalNominaEmpleado(asignarTerminalNominaEmpleado);
                BodyAntesDeAutorizar.CambiarIDPeticion(asignarIdPeticion);

                bodyTipificacion.CambiarReferencia(referencia);
                bodyTipificacion.CambiarReferenciaDetalle([referencia_detalle]);
                bodyTipificacion.CambiarValor(valor);

                BodyAuth.CambiarCodigoRemision(codigo_remision);
                BodyAuth.CambiarFechaHora(new Date());
                BodyAuth.CambiarCodigoNivelServio(nivel_servicio);

                console.log(BodyAntesDeAutorizar.toJSON());
                console.log(bodyTipificacion.toJSON());
                console.log(login.toJSON());
                console.log(BodyAuth.toJSON());

                resAsignar = await PeticionAntesDeAutorizar.crearAsignacion(BodyAntesDeAutorizar.toJSON());
                await new Promise(resolve => setTimeout(resolve, 2000));
                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );
                resAuth = await PeticionAuth.crearAutorizacion(BodyAuth.toJSON());

                console.log(await resAsignar.json(), "respuesta de asignar");
                console.log(await respuesta.json(), "respuesta");
                console.log(await resAuth.json(), "respuesta de autorizar");
                break;

            case 0: // Api orden -> asignas y modificas
                console.log('\x1b[46m\x1b[37mNo se autoriza la carga de trabajo, solo ASIGNACIÓN\x1b[0m');

                BodyAntesDeAutorizar.CambiarGuia(codigo_remision);
                BodyAntesDeAutorizar.CambiarEtiqueta1D(asignarEtiqueta1d);
                BodyAntesDeAutorizar.CambiarEtiqueta2D(asignarEtiqueta2d);
                BodyAntesDeAutorizar.CambiarReferenciaDetalle(asignarReferenciaDetalle);
                BodyAntesDeAutorizar.CambiarNombreEquipo(asignarNombreEquipo);
                BodyAntesDeAutorizar.CambiarVinculoEquipo(asignarVinculoEquipo);
                BodyAntesDeAutorizar.CambiarTerminalDispositivo(asignarTerminalDispositivo);
                BodyAntesDeAutorizar.CambiarTerminalNominaEmpleado(asignarTerminalNominaEmpleado);
                BodyAntesDeAutorizar.CambiarIDPeticion(asignarIdPeticion);

                bodyTipificacion.CambiarReferencia(referencia);
                bodyTipificacion.CambiarReferenciaDetalle([referencia_detalle]);
                bodyTipificacion.CambiarValor(valor);

                console.log(BodyAntesDeAutorizar.toJSON());
                console.log(bodyTipificacion.toJSON());
                console.log(login.toJSON());

                resAsignar = await PeticionAntesDeAutorizar.crearAsignacion(BodyAntesDeAutorizar.toJSON());
                await new Promise(resolve => setTimeout(resolve, 2000));
                respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                    bodyTipificacion.toJSON(),
                    login.toJSON()
                );

                console.log(await resAsignar.json(), "respuesta de asignar");
                console.log(await respuesta.json(), "respuesta");
                break;

            default: // El valor en la columna "Autorizada" en el feature es incorrecto
                console.log('\x1b[41m\x1b[37mDato erroneo - No se autoriza la carga de trabajo\x1b[0m');
                break;
        }
    }, 2000);
});

Then(`se realiza el respectivo proceso de modificar el valor del recaudo en la tabla recaudos campo valor_total por el nuevo valor asignado y en la tabla generacion_rotulos campo recaudo por el nuevo valor asignado. Estas dos tablas pertenecientes a la base de datos CM Testing ciento veinte, a su vez se inserta la guia en la coleccion llamada cambios_valor_agw del proyecto cm_guias_test de firestore, con el campo llamado estado igual a pendiente y cuando el reloj marque un minuto terminado en cero o en cinco, se correra una tarea que realizara el cambio del valor a recaudar en la tabla agw_recaudos campo valor, esta tabla en la base de datos de sandbox_agw. reflejando por ultimo una respuesta de con el estado Recaudo actualizado, el valorAnterior del RCE y el Valor Nuevo Si el cliente esta tipificado codigo_remision devuelve el campo codigoRemision con el numero de guia y los campos referencia y referenciaDetalle vacios, si el cliente es tipificado referencia devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia de la guia la cual se envia en el body de la api, y el campo referenciaDetalle vacio, si el cliente es tipificado referencia y referenciaDetalle devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia que se envia en el body de la api, y el campo referenciaDetalle con la referenciaDetalle que se envia en el body de la api {string} {int}`, async (res: string, status: number) => {
    // [Then] Describes the expected outcome or result of the scenario.
    expect(respuesta.status()).toBe(status);
    expect(resAsignar.status()).toBe(status);
    const responseData = await respuesta.json();
    expect(responseData.isError).toBe(false);
    expect(responseData.data.estado.toLowerCase()).toContain(
        res.toLowerCase()
    );
});