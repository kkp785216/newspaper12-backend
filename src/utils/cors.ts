import { NextFunction, Request, Response } from "express";

const cors = {
  origin: ["http://localhost:3000", "https://newspaper12-backend.vercel.app"],
};

const corsFnc = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (cors.origin?.indexOf(origin as string) >= 0) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

export { corsFnc };
