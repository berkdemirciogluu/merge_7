export namespace Auth {
  export interface Response {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    session_state: string;
    scope: string;
  }

  export interface LoginRequest {
    username?: string;
    password?: string;
  }

  export interface State {
    access_token: string;
    refresh_token: string;
  }

  export interface RefreshRequest {
    refresh_token: string;
  }
}
