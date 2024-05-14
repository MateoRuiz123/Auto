import * as fs from 'fs';
import * as util from 'util';

export default class ImageConverterNode {
  private readFile = util.promisify(fs.readFile);
  //Converts image to base64
  async convertImageToBase64(filePath: string): Promise<string> {
    const data = await this.readFile(filePath);
    return data.toString('base64');
  }
}