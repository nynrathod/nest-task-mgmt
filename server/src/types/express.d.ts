declare namespace Express {
  export interface Request {
    id?: any; // or replace `any` with a more specific type for the user object
  }
}
