import { manager } from "../../commons/commons_hooks";
import { APIResponse } from "playwright/test";

export default class PeticionCrearAsignacion  {
  async crearAsignacion(requestBody: string): Promise<APIResponse> {
    const asignacion = manager.getContext();
    const responseData = await (
      await asignacion
    ).post("https://api.coordinadora.com/cm-asignacion-finalizar-test/api/v1/middleware-finalizar", {
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    });
    return responseData;
  }
}
