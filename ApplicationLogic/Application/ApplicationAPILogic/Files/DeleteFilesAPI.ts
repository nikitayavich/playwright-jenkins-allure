import {BaseAPI} from '../BaseAPI';

export class DeleteFilesAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async MoveFileToTrashById(id) {
    await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "trashNodes", "variables": {"node_ids": [id]}, "query": "mutation trashNodes($node_ids: [ID!]) {\n  trashNodes(node_ids: $node_ids)\n}"},
    });
  };

  async DeleteFilePermanentlyById(id) {
    await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "deleteNodes", "variables": {"node_ids": [id]}, "query": "mutation deleteNodes($node_ids: [ID!]) {\n  deleteNodes(node_ids: $node_ids)\n}"},
    });
  };
}
