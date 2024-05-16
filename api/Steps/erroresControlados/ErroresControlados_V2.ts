import { AfterStep, Given, Then, When } from "@cucumber/cucumber";
import { APIResponse, expect } from '@playwright/test';
import {BodyLogin} from "../../endpoint/ServicioDeAutenticacion/ServicioDeAutenticacion_Body";
import {BodyTipificacion} from "../../endpoint/ServicioDeTipificacion/Tipificacion_Body";
import PeticionTipificacion from "../../endpoint/ServicioDeTipificacion/Tipificacion_Request";

const login = new BodyLogin();
const bodyTipificacion = new BodyTipificacion()
const PeticionModificarValor = new PeticionTipificacion();

let res: APIResponse;

Given("que se entrego una guia con referencia y se quiere verificar un error controlado {string} {string} {string}", async (string, string1, string2) => {
    console.log('************ ', string);
    login.cambioUsuarioYcontrasena(string1, string2);
});
When("se realiza la consulta de la guia con referencia {string} {int}", async (string, int) => {
    setTimeout(async () => {
        bodyTipificacion.CambiarReferencia(string);
        bodyTipificacion.CambiarValor(int);
        console.log(bodyTipificacion.toJSON());
        console.log(login.toJSON());
        res = await PeticionModificarValor.MODIFICAR_AGREGAR_RCE(
            bodyTipificacion.toJSON(),
            login.toJSON()
        );
        console.log(await res.json(), 'respuesta');
    }, 5000);
});
AfterStep(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
})
Then("se debe mostrar el error controlado {string} {int}", async (string, int) => {
    expect(res.status()).toBe(int);
    expect(JSON.stringify(await res.json())).toContain(string);
});