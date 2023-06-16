import {BaseAPI} from '../BaseAPI';

export class CreateCalendarAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateAppointmentRequest(title: string, user: string, attendees: string, body: string, location = "", roomName = "", roomLink = "") {
    const currentdate = new Date();
    const currentDatePlus10sec = new Date(Date.now() + 3600000);
    const currentdateISO = this.ParseDateToISO(currentdate);
    const currentDatePlus10secISO = this.ParseDateToISO(currentDatePlus10sec);
    const currentdateUSFull = this.ParseDateToUSFull(currentdate);
    const currentdateUSTime = this.ParseDateToUSTime(currentdate);
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.createAppointmentRequest}`, {
      data: {
        "Body": {
          "CreateAppointmentRequest": {
            "echo": "1",
            "comp": "0",
            "m": {
              "e": [
                {
                  "a": attendees,
                  "p": attendees,
                  "t": "t",
                },
                {
                  "a": user,
                  "t": "f",
                },
              ],
              "inv": {
                "comp": [
                  {
                    "alarm": [
                      {
                        "action": "DISPLAY",
                        "trigger": {
                          "rel": {
                            "m": "5",
                            "related": "START",
                            "neg": "1",
                          },
                        },
                      },
                    ],
                    "at": [
                      {
                        "a": attendees,
                        "d": attendees,
                        "role": "REQ",
                        "ptst": "NE",
                        "rsvp": "1",
                      },
                    ],
                    "allDay": "0",
                    "fb": "B",
                    "loc": location,
                    "name": title,
                    "or": {
                      "a": user,
                    },
                    "recur": null,
                    "status": "CONF",
                    "s": {
                      "d": currentdateISO,
                    },
                    "e": {
                      "d": currentDatePlus10secISO,
                    },
                    "class": "PUB",
                    "draft": false,
                    "xprop": [
                      {
                        "name": "X-CRB-MEETING-ROOM",
                        "value": "X-CRB-MEETING-ROOM",
                        "xparam": [
                          {
                            "name": "ROOM-LINK",
                            "value": roomLink,
                          },
                          {
                            "name": "ROOM-NAME",
                            "value": `${roomName}'s Personal Room`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              "l": "10",
              "mp": {
                "ct": "multipart/alternative",
                "mp": [
                  {
                    "ct": "text/html",
                    "content": `<html>
                                  <body id='htmlmode'>-:::_::_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_::_:_::-
                                    <h3>undefined have invited you to a new meeting!</h3>
                                    <p>Subject: ${title}</p>
                                    <p>Organizer: undefined</p>
                                    <p>Location: </p>
                                    <p>Time: ${currentdateUSFull} - ${currentdateUSTime}</p>
                                    <p>Invitees: ${attendees}</p>
                                    <br/>-:::_::_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_::_:_::-${body}`,
                  },
                  {
                    "ct": "text/plain",
                    "content": `-:::_::_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_::_:_::-\n 
                              have invited you to a new meeting!\n\nSubject: ${title} \nOrganizer: \"undefined \n\nTime: ${currentdateUSFull} - ${currentdateUSTime}\n 
                              \nInvitees: 2 \n\n\n-:::_::_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_::_:_::-\n${body}`,
                  },
                ],
              },
              "su": title,
            },
            "_jsns": "urn:zimbraMail",
          },
        },
        "Header": {
          "context": {
            "_jsns": "urn:zimbra",
            "session": {
              "id": "117",
              "_content": "117",
            },
            "account": {
              "by": "name",
              "_content": user,
            },
            "userAgent": {
              "name": "CarbonioWebClient - Chrome 104.0.0.0 (Windows)",
              "version": "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS",
            },
          },
        },
      },
    });
    const responseBody = await this.GetResponseBody(response);
    const id = responseBody.Body.CreateAppointmentResponse.echo[0].m[0].id;
    return id;
  };

  async CreateCalendarRequest(name: string, user: string) {
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.createFolderRequest}`, {
      data: {
        "Body": {
          "CreateFolderRequest": {
            "_jsns": "urn:zimbraMail",
            "folder": {
              "color": "0",
              "f": "",
              "l": "1",
              "name": name,
              "view": "appointment",
            },
          },
        },
        "Header": {
          "context": {
            "_jsns": "urn:zimbra",
            "notify": {
              "seq": 4,
            },
            "session": {
              "id": "13384",
              "_content": "13384",
            },
            "account": {
              "by": "name",
              "_content": user,
            },
            "userAgent": {
              "name": "CarbonioWebClient - Chrome 106.0.0.0 (Windows)",
              "version": "22.10.0_ZEXTRAS_202210 agent 20220923-0902 FOSS",
            },
          },
        },
      },
    });
    const body = await this.GetResponseBody(response);
    return body.Body.CreateFolderResponse.folder[0].id;
  };

  ParseDateToISO(date) {
    return (date.toISOString()).split('-').join('').split(':').join('').replace(/\.\d+Z/, 'Z');
  };

  ParseDateToUSFull(date) {
    return (date.toLocaleString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric'}).replace(`${date.toLocaleString('en-US', {year: 'numeric'})},`, date.toLocaleString('en-US', {year: 'numeric'})));
  };

  ParseDateToUSTime(date) {
    return (date.toLocaleString('en-US', {hour: 'numeric', hour12: true, minute: 'numeric'}));
  };
};
