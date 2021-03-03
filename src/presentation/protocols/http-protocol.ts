export interface HTTPRequest {
  body?: any;
  params?: any;
}

export interface HTTPResponse {
  status_code: number;
  body?: any;
}
