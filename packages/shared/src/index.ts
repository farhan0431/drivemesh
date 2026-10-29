export interface GoogleAuthStatus {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  quota?: {
    limitBytes: number;
    usageBytes: number;
    usagePercent: number;
    limitFormatted: string;
    usageFormatted: string;
  };
  mountStatus?: {
    active: boolean;
    mountPoint: string;
    protocol: string;
  };
}

export interface NetworkCredentialsInfo {
  username: string;
  hasPassword: boolean;
  serverDomain: string;
  serverHost: string;
  serverIp: string;
  smbUrl: string;
  windowsPath: string;
  webdavUrl: string;
}

export interface SystemServiceStatus {
  smbService: boolean;
  webdavService: boolean;
  mountActive: boolean;
  sslActive: boolean;
  domain: string;
}

export interface SetCredentialsPayload {
  username: string;
  password?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
