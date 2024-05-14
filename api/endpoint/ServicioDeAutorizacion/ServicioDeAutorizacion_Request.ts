import { APIResponse } from "playwright/test";
import { manager } from "../../commons/commons_hooks";

export default class PeticionCrearAutotizacion  {
    async crearAutorizacion(requestBody: string): Promise<APIResponse> {
        const auth = manager.getContext();
        const responseData = await (
            await auth
        ).post("https://apiv2-test.coordinadora.com/reparto/cm-worker-asignar-distribucion/validar", {
            headers: {
                "Content-Type": "application/json",
            },
            data: requestBody,
        });
        return responseData;
    }
}