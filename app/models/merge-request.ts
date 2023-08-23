export namespace MergeRequest {
  export interface Common {
    cuser?: string;
    cdate?: string;
    uuser?: string | null;
    udate?: string;
    id?: number;
  }

  export interface Project extends Common {
    name?: string;
    shortCode?: string;
  }

  export interface Environment extends Project {
    order?: number;
    project?: Project;
  }

  export interface Status extends Project {
    group?: string;
  }

  export interface GetAllMergeRequestsResponse {
    items?: Item[];
    pageInformation?: PageInformation;
  }

  export interface PageInformation {
    id?: string;
    currentPage?: number;
    total?: number;
    take?: number;
    nextPage?: number;
  }

  export interface Item extends Common {
    email?: string;
    description?: string | null;
    sourceEnvironment?: Environment;
    targetEnvironment?: Environment;
    project?: Project;
    status?: Status;
  }

  export interface GetAllMergeRequestsRequest {
    projectName: string;
    page: number;
    limit: number;
  }

  export interface MergeRequestDataTable {
    id?: number;
    requestedBy?: string;
    requstedDate?: string;
    status?: string;
    lastUpdatedDate?: string;
    fromEnv?: string;
    toEnv?: string;
  }

  export interface GetMergeRequestItemsResponse extends Common {
    taskName: string;
    beUser: string;
    feUser: string;
    omUser: string;
    mergeRequest: Item;
    feStatus: Status;
    beStatus: Status;
    omStatus: Status;
  }

  export interface State {
    items: Item[];
    pageInformation: PageInformation;
  }

  export interface MergeRequestItemsDataTable {
    [x: string]: any;
    key?: React.Key;
    taskName?: string;
    feStatus?: string;
    beStatus?: string;
    omStatus?: string;
    beUser?: string;
    feUser?: string;
    omUser?: string;
  }

  export interface UpdateMergeRequestRequest {
    id: number;
    type: string;
    status: { shortCode: string };
  }
}
