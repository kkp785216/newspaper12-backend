import { NextFunction, Request, Response } from "express";

const cors = {
  origin: [
    /^(?:https?:\/\/)?localhost(:\d+)?$/,
    /^(?:https?:\/\/)?((www\.)?[\w-]+\.)vercel\.app$/,
  ],
};

const corsFnc = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    for (const allowedOrigin of cors.origin) {
      if (allowedOrigin.test(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        break;
      }
    }
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

export { corsFnc };
