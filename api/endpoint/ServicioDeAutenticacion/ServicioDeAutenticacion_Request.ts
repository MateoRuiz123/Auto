import { manager } from "../../commons/commons_hooks";

export default class CrearLogin{
  async sendRequest(requestBody: string) {
    const crearlogin = manager.getContext();
    const responseData = await (
        await crearlogin
      ).post('cm-gde-orquestador-gke/autenticar', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestBody,
      });
    const token=await responseData.json()
    return token;

  }
}