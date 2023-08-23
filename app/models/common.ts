export namespace Common {
  export interface GenericResponse<T = any> {
    data: T;
    status: number;
    message?: string;
  }
}
