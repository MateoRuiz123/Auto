import {
  Before,
  BeforeAll,
  AfterAll,
  Given,
  After,
  Status,
} from "@cucumber/cucumber";
import PlaywrightManager from "./playwright_manager";
import Database from "./database_manager";

export const manager = new PlaywrightManager();
let mainURL = "";
export const db = Database.getInstance();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Before({ tags: "@Ignore" }, async () => "skipped" as any);
Before({ tags: "@ListarVias or @listarCiudades or @ListarSoluciones or @EjecutarTodos or @DetalleDeRegistroDeUnaSolucion or @listarHistoricoNovedades or @ConsultarSolucionesYRechazos" }, async () => {
  mainURL = "https://apiv2-test.coordinadora.com";
  await manager.initialize("chrome", mainURL);
});
Before({ tags: "@Modificacion" }, async () => {
  mainURL = "https://apiv2-test.coordinadora.com/guias/";
  await manager.initialize("chrome", mainURL);
});
Given("abre la pagina {string}", async (string) => {
  await manager.navigate(string);
});
BeforeAll(async () => { });
// eslint-disable-next-line func-names
After(async function (Scenario) {
  if (Scenario.result?.status === Status.FAILED) {
    const screenshotRoute: string = await manager.screenshot(
      `./report/${Scenario.pickle.id}.png`
    );
    this.attach(screenshotRoute, "image/png");
  }
  await manager.close();
});
AfterAll(async () => {
  await manager.close();
  await db.closeConnection();
});
