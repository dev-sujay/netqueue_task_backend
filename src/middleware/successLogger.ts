import type { Request, Response, NextFunction } from "express"
import Logger from "../utils/logger"

export const successLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json
  res.json = function (body) {
    Logger.info(`[${res.statusCode}] ${req.method} ${req.originalUrl}`, {
      responseBody: body,
      requestBody: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    })
    return originalJson.call(this, body)
  }
  next()
}

