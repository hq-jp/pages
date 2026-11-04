import type { File } from "@google-cloud/storage";
import type { Response } from "express";

import isGoogleError from "../utils/isGoogleError";
import withCharset from "../utils/withCharset";

export default async (file: File, res: Response): Promise<void> => {
  file
    .createReadStream()
    .on("error", (e) => {
      if (isGoogleError(e)) {
        res.status(e.code);
        res.send(e.message);
      } else {
        res.status(500);
        res.send("Internal server error");
      }
    })
    .on("response", (response) => {
      const contentType = withCharset(response.headers["content-type"]);
      if (contentType) res.setHeader("content-type", contentType);
    })
    .on("end", () => res.end())
    .pipe(res);
};
