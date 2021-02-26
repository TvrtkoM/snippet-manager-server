declare namespace Express {
  interface Request {
    user: string | Record<string, unknown>;
  }
}
