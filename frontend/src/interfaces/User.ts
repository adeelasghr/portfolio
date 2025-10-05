export interface UsersBrief {
    userID: number;
    userCode: string;
    name: string;
    email: string;
    roles: string;
    status: string;
  }

  export interface LoginResponse {
  token?: string;
  user?: any;
  success?: boolean;
  message?: string;
  errors?: string[];
}