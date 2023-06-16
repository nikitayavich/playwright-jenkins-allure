import {BaseAPI} from '../BaseAPI';

export class FilesAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async GetActiveFiles() {
    let activeFiles = [];
    const response = await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "getChildren", "variables": {"shares_limit": 1, "node_id": "LOCAL_ROOT", "children_limit": 25, "sort": "NAME_ASC"}, "query": "query getChildren($node_id: ID!, $children_limit: Int!, $page_token: String, $sort: NodeSort!, $shares_limit: Int = 1) {\n  getNode(node_id: $node_id) {\n    id\n    name\n    ... on Folder {\n      children(limit: $children_limit, page_token: $page_token, sort: $sort) {\n        nodes {\n          ...Child\n          __typename\n        }\n        page_token\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment Child on Node {\n  ...BaseNode\n  owner {\n    id\n    full_name\n    email\n    __typename\n  }\n  updated_at\n  last_editor {\n    id\n    full_name\n    email\n    __typename\n  }\n  parent {\n    id\n    name\n    ...Permissions\n    __typename\n  }\n  shares(limit: $shares_limit) {\n    ...Share\n    __typename\n  }\n  __typename\n}\n\nfragment BaseNode on Node {\n  id\n  name\n  type\n  ...Permissions\n  ... on File {\n    size\n    mime_type\n    extension\n    version\n    __typename\n  }\n  flagged\n  rootId\n  __typename\n}\n\nfragment Permissions on Node {\n  permissions {\n    can_read\n    can_write_file\n    can_write_folder\n    can_delete\n    can_add_version\n    can_read_link\n    can_change_link\n    can_share\n    can_read_share\n    can_change_share\n    __typename\n  }\n  __typename\n}\n\nfragment Share on Share {\n  permission\n  share_target {\n    ... on User {\n      email\n      full_name\n      id\n      __typename\n    }\n    ... on DistributionList {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  created_at\n  node {\n    id\n    type\n    __typename\n  }\n  __typename\n}"},
    });
    const body = await this.GetResponseBody(response);
    if (body.data.getNode.children.nodes) {
      activeFiles = body.data.getNode.children.nodes;
    }
    return activeFiles;
  };

  async GetTrashFiles() {
    let trashFiles = [];
    const response = await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "findNodes", "variables": {"shares_limit": 1, "shared_with_me": false, "folder_id": "TRASH_ROOT", "cascade": false, "limit": 25, "sort": "NAME_ASC"}, "query": "query findNodes($keywords: [String!], $flagged: Boolean, $shared_by_me: Boolean, $shared_with_me: Boolean, $folder_id: String, $cascade: Boolean, $limit: Int!, $page_token: String, $sort: NodeSort, $shares_limit: Int = 1, $direct_share: Boolean) {\n  findNodes(\n    keywords: $keywords\n    flagged: $flagged\n    shared_by_me: $shared_by_me\n    shared_with_me: $shared_with_me\n    folder_id: $folder_id\n    cascade: $cascade\n    limit: $limit\n    page_token: $page_token\n    sort: $sort\n    direct_share: $direct_share\n  ) {\n    nodes {\n      ...Child\n      shares(limit: $shares_limit) {\n        created_at\n        __typename\n      }\n      __typename\n    }\n    page_token\n    __typename\n  }\n}\n\nfragment Child on Node {\n  ...BaseNode\n  owner {\n    id\n    full_name\n    email\n    __typename\n  }\n  updated_at\n  last_editor {\n    id\n    full_name\n    email\n    __typename\n  }\n  parent {\n    id\n    name\n    ...Permissions\n    __typename\n  }\n  __typename\n}\n\nfragment BaseNode on Node {\n  id\n  name\n  type\n  ...Permissions\n  ... on File {\n    size\n    mime_type\n    extension\n    version\n    __typename\n  }\n  flagged\n  rootId\n  __typename\n}\n\nfragment Permissions on Node {\n  permissions {\n    can_read\n    can_write_file\n    can_write_folder\n    can_delete\n    can_add_version\n    can_read_link\n    can_change_link\n    can_share\n    can_read_share\n    can_change_share\n    __typename\n  }\n  __typename\n}"},
    });

    const body = await this.GetResponseBody(response);
    if (body.data.findNodes.nodes) {
      trashFiles = body.data.findNodes.nodes;
    }
    return trashFiles;
  };

  async FilesSearchQuery(query) {
    let fileId = '';
    const response = await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "findNodes", "variables": {"shares_limit": 1, "keywords": [query], "limit": 25, "sort": "NAME_ASC"}, "query": "query findNodes($keywords: [String!], $flagged: Boolean, $shared_by_me: Boolean, $shared_with_me: Boolean, $folder_id: String, $cascade: Boolean, $limit: Int!, $page_token: String, $sort: NodeSort, $shares_limit: Int = 1, $direct_share: Boolean) {\n  findNodes(\n    keywords: $keywords\n    flagged: $flagged\n    shared_by_me: $shared_by_me\n    shared_with_me: $shared_with_me\n    folder_id: $folder_id\n    cascade: $cascade\n    limit: $limit\n    page_token: $page_token\n    sort: $sort\n    direct_share: $direct_share\n  ) {\n    nodes {\n      ...Child\n      shares(limit: $shares_limit) {\n        created_at\n        __typename\n      }\n      __typename\n    }\n    page_token\n    __typename\n  }\n}\n\nfragment Child on Node {\n  ...BaseNode\n  owner {\n    id\n    full_name\n    email\n    __typename\n  }\n  updated_at\n  last_editor {\n    id\n    full_name\n    email\n    __typename\n  }\n  parent {\n    id\n    name\n    ...Permissions\n    __typename\n  }\n  __typename\n}\n\nfragment BaseNode on Node {\n  id\n  name\n  type\n  ...Permissions\n  ... on File {\n    size\n    mime_type\n    extension\n    version\n    __typename\n  }\n  flagged\n  rootId\n  __typename\n}\n\nfragment Permissions on Node {\n  permissions {\n    can_read\n    can_write_file\n    can_write_folder\n    can_delete\n    can_add_version\n    can_read_link\n    can_change_link\n    can_share\n    can_read_share\n    can_change_share\n    __typename\n  }\n  __typename\n}"},
    });

    const body = await this.GetResponseBody(response);
    if (body.data.findNodes.nodes) {
      fileId = body.data.findNodes.nodes[0].id;
    }
    return fileId;
  };

  async UploadTo(id) {
    let fileId = '';
    const response = await this.page.request.post(`${this.uploadToRequest}`, {
      data: {"nodeId": id, "targetModule": "MAILS"},
    });
    const body = await this.GetResponseBody(response);
    if (body) {
      fileId = body.attachmentId;
    }
    return fileId;
  };

  async GetNodeId() {
    let activeFiles = '';
    const response = await this.page.request.post(`${this.graphqlServiceUrl}`, {
      data: {"operationName": "getNode", "variables": {"node_id": "62705605-f43c-45f1-9a2d-af22ca9b6ac4", "children_limit": 25, "sort": "NAME_ASC", "shares_limit": 6}, "query": "query getNode($node_id: ID!, $children_limit: Int!, $page_token: String, $sort: NodeSort!, $shares_limit: Int!, $shares_cursor: String, $shares_sorts: [ShareSort!]) {\n  getNode(node_id: $node_id) {\n    ...BaseNode\n    description\n    owner {\n      id\n      email\n      full_name\n      __typename\n    }\n    creator {\n      id\n      email\n      full_name\n      __typename\n    }\n    last_editor {\n      id\n      email\n      full_name\n      __typename\n    }\n    created_at\n    updated_at\n    parent {\n      id\n      name\n      ...Permissions\n      __typename\n    }\n    shares(limit: $shares_limit, cursor: $shares_cursor, sorts: $shares_sorts) {\n      ...Share\n      __typename\n    }\n    ... on Folder {\n      children(limit: $children_limit, page_token: $page_token, sort: $sort) {\n        nodes {\n          ...Child\n          __typename\n        }\n        page_token\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BaseNode on Node {\n  id\n  name\n  type\n  ...Permissions\n  ... on File {\n    size\n    mime_type\n    extension\n    version\n    __typename\n  }\n  flagged\n  rootId\n  __typename\n}\n\nfragment Permissions on Node {\n  permissions {\n    can_read\n    can_write_file\n    can_write_folder\n    can_delete\n    can_add_version\n    can_read_link\n    can_change_link\n    can_share\n    can_read_share\n    can_change_share\n    __typename\n  }\n  __typename\n}\n\nfragment Child on Node {\n  ...BaseNode\n  owner {\n    id\n    full_name\n    email\n    __typename\n  }\n  updated_at\n  last_editor {\n    id\n    full_name\n    email\n    __typename\n  }\n  parent {\n    id\n    name\n    ...Permissions\n    __typename\n  }\n  shares(limit: $shares_limit) {\n    ...Share\n    __typename\n  }\n  __typename\n}\n\nfragment Share on Share {\n  permission\n  share_target {\n    ... on User {\n      email\n      full_name\n      id\n      __typename\n    }\n    ... on DistributionList {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  created_at\n  node {\n    id\n    type\n    __typename\n  }\n  __typename\n}"},
    });
    const body = await this.GetResponseBody(response);
    if (body.data.getNode.id) {
      activeFiles = body.data.getNode.id;
    }
    return activeFiles;
  };

  async DeleteFilesViaAPI(apiManager) {
    await Promise.all((await this.GetActiveFiles()).map(async (file) => {
      return apiManager.deleteFilesAPI.MoveFileToTrashById(file.id);
    }));
    await Promise.all((await this.GetTrashFiles()).map(async (file) => {
      return apiManager.deleteFilesAPI.DeleteFilePermanentlyById(file.id);
    }));
  }
}
