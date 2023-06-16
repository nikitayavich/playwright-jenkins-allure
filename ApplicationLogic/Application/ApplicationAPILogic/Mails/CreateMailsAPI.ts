import {BaseAPI} from '../BaseAPI';

export class CreateMailsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  MsgType = {
    Reply: 'r',
    Forward: 'w',
  };

  async SendMsgRequest(subject, mailBody, from, toArray, ccArray?, bccArray?, origId?, msgType?, fileId?) {
    let id = '';
    const response = await this.FormingMsgRequest(this.sendMsgRequest, subject, mailBody, from, toArray, ccArray, bccArray, origId, msgType, fileId);
    const body = await this.GetResponseBody(response);
    if (body.Body.SendMsgResponse.m) {
      id = body.Body.SendMsgResponse.m[0].id;
    }
    return id;
  };

  async SaveDraftRequest(subject, draftBody, from, toArray, ccArray?, bccArray?, origId?, msgType?, fileId?) {
    let id = '';
    const response = await this.FormingMsgRequest(this.saveDraftRequest, subject, draftBody, from, toArray, ccArray, bccArray, origId, msgType, fileId);
    const body = await this.GetResponseBody(response);
    if (body.Body.SaveDraftResponse.m) {
      id = body.Body.SaveDraftResponse.m[0].id;
    }
    return id;
  };

  async FormingMsgRequest(requestType, subject, body, from, toArray, ccArray = [], bccArray = [], origId?, msgType?, fileId?) {
    const request = await this.page.request.post(`${this.soapServiceUrl}${requestType}`, {
      data: {
        Body: {
          [requestType]: {
            _jsns: 'urn:zimbraMail',
            m: {
              attach: (() => fileId ? (requestType === this.sendMsgRequest ? {mp: [{"part": "2", "mid": fileId}]}: {"mp": [], "aid": fileId}) : {mp: []})(),
              su: {_content: subject},
              e: [
                {t: 'f', a: from, d: ''},
                ...toArray.map((to) => to = {t: 't', a: to}),
                ...ccArray.map((cc) => cc = {t: 'c', a: cc}),
                ...bccArray.map((bcc) => bcc = {t: 'b', a: bcc}),
              ],
              mp: [
                {
                  ct: 'multipart/alternative',
                  mp: [
                    {ct: 'text/html', body: true, content: {_content: `<p>${body}</p>`}},
                    {ct: 'text/plain', content: {_content: body}},
                  ],
                },
              ],
              origid: origId,
              rt: msgType,
            },
          },
        },
      },
    });
    return request;
  };
};
