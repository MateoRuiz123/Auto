import { APIResponse } from "playwright/test";
import CrearLogin from "../ServicioDeAutenticacion/ServicioDeAutenticacion_Request";
import {manager} from "../../commons/commons_hooks";
const requestLogin = new CrearLogin();
export default class PeticionTipificacion {
  async modificarTipificacionCodigoRemision(
    requestBody: string,
    loginBody: string
  ): Promise<APIResponse> {
    const tokens = await requestLogin.sendRequest(loginBody);
    const token = tokens.data.token;
    const modificacionDelValor = manager.getContext();
    const responseData = await (
      await modificacionDelValor
    ).post("cm-gde-orquestador-gke/cambiar-valor", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: requestBody,
    });
    return responseData;
  }
  async MODIFICAR_AGREGAR_RCE(
    requestBody: string,
    loginBody: string
  ): Promise<APIResponse> {
    try {
      const tokens = await requestLogin.sendRequest(loginBody);
      const token = tokens.data.token;
      const modificacionDelValor = await manager.getContext();
      const responseData = await modificacionDelValor.post(
        "cm-gde-orquestador-gke/cambiar-valor",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: requestBody,
        }
      );
      return responseData;
    } catch (error) {
      console.error("Error al modificar el valor del recaudo:", error);
      throw error;
    }
  }
}
