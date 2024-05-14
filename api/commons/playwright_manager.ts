import {
  chromium,
  firefox,
  webkit,
  Page,
  Browser,
  request,
  APIRequestContext,
} from "playwright";
import ImageConverterNode from "./imageConverterNode";
import { manager } from "./commons_hooks";

export default class PlaywrightManager {
  private browser: Browser | null;

  private page: Page | null;

  public rootURL: string | null;

  private declare context: APIRequestContext;

  constructor() {
    this.browser = null;
    this.page = null;
    this.rootURL = null;
  }

  private managers = 0;

  async initialize(browser: string, mainURL: string): Promise<void> {
    if (this.managers === 0) {
      this.rootURL = mainURL;
      switch (browser) {
        case "edge":
          this.browser = await chromium.launch({
            channel: "msedge",
            headless: false,
          });
          break;
        case "firefox":
          this.browser = await firefox.launch();
          break;
        case "safari":
          this.browser = await webkit.launch();
          break;
        default:
          this.browser = await chromium.launch();
      }
      this.page = await this.browser.newPage();
      this.context = await request.newContext({
        baseURL: mainURL,
      });
      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>> URL desde el initialize enviada: " +
          mainURL +
          " conteo managers: " +
          this.managers
      );
      this.managers++;
    } else {
      await manager.close();
      this.rootURL = mainURL;
      switch (browser) {
        case "edge":
          this.browser = await chromium.launch({
            channel: "msedge",
            headless: false,
          });
          break;
        case "firefox":
          this.browser = await firefox.launch();
          break;
        case "safari":
          this.browser = await webkit.launch();
          break;
        default:
          this.browser = await chromium.launch();
      }
      this.page = await this.browser.newPage();
      this.context = await request.newContext({
        baseURL: mainURL,
      });
      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>> URL desde el initialize enviada: " +
          mainURL +
          " conteo managers: " +
          this.managers
      );
    }
  }

  async navigate(url: string): Promise<void> {
    if (this.page) {
      await this.page.goto(url);
    }
  }

  async type(selector: string, text: string) {
    await this.page?.type(selector, text);
    await this.page?.keyboard.press("Enter");
  }

  async getContext(): Promise<APIRequestContext> {
    return this.context;
  }

  async click(selector: string): Promise<void> {
    await this.page?.click(selector, { timeout: 2000 });
  }

  async getText(selector: string): Promise<string | undefined> {
    const element = await this.page?.$(selector);
    const texto = await element?.innerText();
    return texto;
  }

  async waitForSelector(selector: string): Promise<void> {
    await this.page?.waitForLoadState("load");
    await this.page?.waitForSelector(selector);
  }

  async fill(selector: string, text: string): Promise<void> {
    await this.page?.fill(selector, text, { timeout: 2000 });
  }

  async screenshot(screenshotRoute: string): Promise<string> {
    await this.page?.screenshot({ path: screenshotRoute, fullPage: true });
    const converter = new ImageConverterNode();
    const base64Image = await converter.convertImageToBase64(screenshotRoute);
    return base64Image;
  }

  async screenshotwithHighlight(
    selector: string,
    screenshotRoute: string
  ): Promise<string> {
    await this.highlightElement(selector, "red");
    const base64Image = await this.screenshot(screenshotRoute);
    return base64Image;
  }

  async highlightElement(selector: string, color: string): Promise<void> {
    await this.page?.$eval(
      selector,
      (el, color) => {
        el.style.border = `3px solid ${color}`;
      },
      color
    );
  }

  async waitForTime(time: number): Promise<void> {
    await this.page?.waitForTimeout(time);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async textContent(selector: string): Promise<string | null | undefined> {
    return this.page?.textContent(selector);
  }

  async waitForLoadState(): Promise<void> {
    await this.page?.waitForLoadState("domcontentloaded");
  }

  async getHref(selector: string): Promise<string | null | undefined> {
    const element = await this.page?.$(selector);
    return element?.getAttribute("href");
  }
}
