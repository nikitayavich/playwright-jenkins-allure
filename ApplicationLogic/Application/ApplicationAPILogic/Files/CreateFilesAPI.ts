import {BaseAPI} from '../BaseAPI';
import fs from "fs";
import path from "path";

export class CreateFilesAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async UploadFileViaAPI(fileName, unicFilePrefix = '') {
    const file = path.resolve("./TestData/Files/", fileName);
    const image = fs.readFileSync(file);
    const buffer = Buffer.from(unicFilePrefix + fileName);
    const fileNameBase64 = buffer.toString('base64');
    await this.page.request.post(`${this.uploadFileRequest}`, {
      headers: {
        Accept: "*/*",
        ContentType: "multipart/form-data",
        Filename: fileNameBase64,
      },
      multipart: {
        file:
        {
          name: file,
          mimeType: "image/png",
          buffer: image,
        },
      },
    });
  };

  async CreateDocument(name) {
    const response = await this.page.request.post(`${this.createDocumentRequest}`, {
      data: {"filename": name, "type": "LIBRE_DOCUMENT", "destinationFolderId": "LOCAL_ROOT"},
    });

    const body = await this.GetResponseBody(response);
    return body.fileName;
  };

  async CreateSpreadsheet(name) {
    const response = await this.page.request.post(`${this.createDocumentRequest}`, {
      data: {"filename": name, "type": "LIBRE_SPREADSHEET", "destinationFolderId": "LOCAL_ROOT"},
    });

    const body = await this.GetResponseBody(response);
    return body.fileName;
  };

  async CreatePresentation(name) {
    const response = await this.page.request.post(`${this.createDocumentRequest}`, {
      data: {"filename": name, "type": "LIBRE_PRESENTATION", "destinationFolderId": "LOCAL_ROOT"},
    });

    const body = await this.GetResponseBody(response);
    return body.fileName;
  };

  async CreateDocumentForUpload(name) {
    const response = await this.page.request.post(`${this.createDocumentRequest}`, {
      data: {"filename": name, "type": "LIBRE_DOCUMENT", "destinationFolderId": "LOCAL_ROOT"},
    });

    const body = await this.GetResponseBody(response);
    return body.nodeId;
  };
}
