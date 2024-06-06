export interface AppConfigType {
  theme: string;
  host: string;
  statusBarHeight: number;
}

export interface UserType {
  adid: string;
  avatar: string | null;
  eid: string;
  email: string | null;
  mobile: string | null;
  sex: number | null;
  nickName: string;
  username: string;
  chineseName: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  organizationName: string;
  jobName: string;
  preference: string;
  thumbAvatar: string | null;
  status: number;
  supervisorEmployeeNumber?: string;
  type?: number;
  userStatus?: number;
  userType?: number;
  [key: string]: string;
}
export interface ChooseDocumentResult {
  canceled: boolean;
  assets?: Array<{
    fileCopyUri: string | null;
    size: number;
    name: string;
    type: string;
    uri: string;
    base64: string | null;
  }>;
}

export interface OpenAlbumResult {
  canceled: boolean;
  assets: Arrauy<{
    width: number;
    mimeType: string;
    rotation: string | null;
    base64: string;
    filesize: 621243;
    uri: string;
    height: number;
    exif: string | null;
    duration: any;
    fileName: string;
    type: string;
    assetId: any;
  }>;
}

export interface OpenCameraResult {
  canceled: boolean;
  assets: [
    {
      originalPath: string;
      base64: string;
      mimeType: string;
      height: number;
      width: number;
      fileName: string;
      fileSize: number;
      uri: string;
    },
  ];
}

export interface LocationType {
  accuracy: number;
  altitude: number;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
}
