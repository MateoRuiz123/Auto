import { APIResponse } from 'playwright';
import Database from '../commons/database_manager';
import { BodyLogin } from './../endpoint/ServicioDeAutenticacion/ServicioDeAutenticacion_Body';
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import BodyAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_body";
import BodyAutorizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Body";
import { BodyTipificacion } from "../endpoint/ServicioDeTipificacion/Tipificacion_Body";
import PeticionCrearAsignacion from "../endpoint/ServicioDeAsignacion/ServicioAsignacion_request";
import PeticionCrearAutotizacion from "../endpoint/ServicioDeAutorizacion/ServicioDeAutorizacion_Request";
import PeticionTipificacion from "../endpoint/ServicioDeTipificacion/Tipificacion_Request";

export const login = new BodyLogin();
const db = Database.getInstance();
const bodyAsignar = new BodyAsignacion();
const bodyAuth = new BodyAutorizacion();
const bodyTipificacion = new BodyTipificacion();
const PeticionAsignar = new PeticionCrearAsignacion();
const PeticionAuth = new PeticionCrearAutotizacion();
const PeticionModificarValor = new PeticionTipificacion();

let respuesta: APIResponse, resAsignar: APIResponse, resAuth: APIResponse;

Given(`que soy un usuario de GDE tipificado con codigo_remision {string} {string} {string}`, (cp: string, user: string, pass: string) => {
    // [Given] Sets up the initial state of the system.
    console.log(cp)
    login.cambioUsuarioYcontraseña(user, pass)
});

When(`en la api cambio de valor de GDE, envio una guia con nivel de servicio veintidos estado diferente a recibir por coordinadora, antes de autorizar a carga de trabajo, con la propiedad valor mayor que cero {string} {int} {int}`, async (codigo_remision: string, valor: number, autorizada: number) => {
    // [When] Describes the action or event that triggers the scenario.
    const consultaRemision = await db.getIdRemision(codigo_remision);
    const consultaNivelServicio = await db.getNivelServicio(consultaRemision);
    const nivel_servicio = await consultaNivelServicio;
    const asignarEtiqueta1d = "7" + codigo_remision + "001";
    const asignarEtiqueta2d = "700100102000000000" + codigo_remision + asignarEtiqueta1d.slice(-3);
    const asignarReferenciaDetalle = codigo_remision + "." + asignarEtiqueta1d.slice(-3).replace(/^0+/, "");
    const asignarNombreEquipo = "[19] CC San Diego";
    const asignarVinculoEquipo = 2;
    const asignarTerminalDispositivo = 2;
    const asignarTerminalNominaEmpleado = 2;
    const asignarIdPeticion = Math.floor(10000 + Math.random() * 90000);

    switch (autorizada) {
        case 1: // Api orden -> asignas, autorizas y modificas
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

            resAsignar = await PeticionAsignar.crearAsignacion(bodyAsignar.toJSON());
            resAuth = await PeticionAuth.crearAutorizacion(bodyAuth.toJSON());
            respuesta = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
                bodyTipificacion.toJSON(),
                login.toJSON()
            );

            console.log(await resAsignar.json(), "respuesta de asignar");
            console.log(await resAuth.json(), "respuesta de autorizar");
            console.log(await respuesta.json(), "respuesta");
            break;
        case 0: // Api orden -> asignas y modificas
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
            resAsignar = await PeticionAsignar.crearAsignacion(bodyAsignar.toJSON());
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
});

Then(`se realiza el respectivo proceso de modificar el valor del recaudo en la tabla recaudos campo valor_total por el nuevo valor asignado y en la tabla generacion_rotulos campo recaudo por el nuevo valor asignado. Estas dos tablas pertenecientes a la base de datos CM Testing ciento veinte, a su vez se inserta la guia en la coleccion llamada cambios_valor_agw del proyecto cm_guias_test de firestore, con el campo llamado estado igual a pendiente y cuando el reloj marque un minuto terminado en cero o en cinco, se correra una tarea que realizara el cambio del valor a recaudar en la tabla agw_recaudos campo valor, esta tabla en la base de datos de sandbox_agw. reflejando por ultimo una respuesta de con el estado Recaudo actualizado, el valorAnterior del RCE y el Valor Nuevo Si el cliente esta tipificado codigo_remision devuelve el campo codigoRemision con el numero de guia y los campos referencia y referenciaDetalle vacios, si el cliente es tipificado referencia devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia de la guia la cual se envia en el body de la api, y el campo referenciaDetalle vacio, si el cliente es tipificado referencia y referenciaDetalle devuelve el campo codigoRemision con el numero de guia, el campo referencia con la referencia que se envia en el body de la api, y el campo referenciaDetalle con la referenciaDetalle que se envia en el body de la api {string} {int}`, (res: string, status: number) => {
    // [Then] Describes the expected outcome or result of the scenario.
    expect(respuesta.status()).to.equal(status);
    const responseData = respuesta.json();
    expect(responseData).to.have.property('estado', res);
});