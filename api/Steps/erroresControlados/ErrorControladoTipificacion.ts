import { BodyLogin } from '../../endpoint/ServicioDeAutenticacion/ServicioDeAutenticacion_Body';
import { Given, Then, When } from "@cucumber/cucumber";
import { APIResponse, expect } from "@playwright/test";
import { BodyTipificacion } from '../../endpoint/ServicioDeTipificacion/Tipificacion_Body';
import PeticionTipificacion from '../../endpoint/ServicioDeTipificacion/Tipificacion_Request';

export const login = new BodyLogin();
const bodyTipificacion = new BodyTipificacion();
const peticionTipificacion = new PeticionTipificacion();

let respuesta: APIResponse;

//! Escenario 1 *****************************
Given('que se Entregó una guía y se quiere generar el cambio de valor en el siguiente servicio {string} {string} {string}', (cp, user, pass) => {
    console.log(cp)
    login.cambioUsuarioYcontrasena(user, pass);
});
When('envío el proceso con la autenticación {string}', async (codigo_remision) => {
    bodyTipificacion.CambiarCodigoRemison(codigo_remision);
    console.log(bodyTipificacion.toJSON());
    console.log(login.toJSON());
    respuesta = await peticionTipificacion.modificarTipificacionCodigoRemision(bodyTipificacion.toJSON(), login.toJSON());
    console.log(await respuesta.json(), 'respuesta escenario 1');
});
Then('el sistema debe generar el siguiente mensaje y la siguiente respuesta {string} {int}', async (res, status) => {
    expect(respuesta.status()).toBe(status);
    expect(JSON.stringify(await respuesta.json())).toBe(res);
});

//! Escenario 2 *****************************
Given('que se Entrego una guía y se requiere generar las validaciones correspondientes a tipificacion Ups {string} {string} {string}', (cp, user, pass) => {
    console.log(cp)
    login.cambioUsuarioYcontrasena(user, pass);
});
When('realizo la peticion al servicio {string} [{string}]', async (referencia, referencia_detalle) => {
    bodyTipificacion.CambiarReferencia(referencia);
    bodyTipificacion.CambiarReferenciaDetalle([referencia_detalle]);
    console.log(bodyTipificacion.toJSON());
    console.log(login.toJSON());
    respuesta = await peticionTipificacion.modificarTipificacionCodigoRemision(bodyTipificacion.toJSON(), login.toJSON());
    console.log(respuesta.json(), 'respuesta escenario 2');
});
Then('el sistema debe retornar la siguiente respuesta {string} {int}', (res, status) => {
    expect(respuesta.status()).toBe(status);
    expect(JSON.stringify(respuesta.json())).toBe(res);
});

//! Escenario 3 *****************************
Given('que se Entrego una guía y se requiere generar las validaciones correspondientes a tipificacion Cueros Velez {string} {string} {string}', (cp, user, pass) => {
    console.log(cp)
    login.cambioUsuarioYcontrasena(user, pass);
});
When('realize la correcta peticion al servicio {string}', async (referencia) => {
    bodyTipificacion.CambiarReferencia(referencia);
    console.log(bodyTipificacion.toJSON());
    console.log(login.toJSON());
    respuesta = await peticionTipificacion.modificarTipificacionCodigoRemision(bodyTipificacion.toJSON(), login.toJSON());
    console.log(respuesta.json(), 'respuesta escenario 3');
});
Then('el sistema debe retornarme las siguientes respuestas {string} {int}', (res, status) => {
    expect(respuesta.status()).toBe(status);
    expect(JSON.stringify(respuesta.json())).toBe(res);
});