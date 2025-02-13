import path from "path"

import express from "express"
import { Storage } from "@google-cloud/storage"

import renderIndexPage from "./render/indexPage"
import renderSingleFile from "./render/singleFile"

const PORT = Number(process.env.PORT) || 8080
const bucketName = process.env.GCLOUD_STORAGE_BUCKET
if (!bucketName) {
  throw new Error(
    `You must set GCLOUD_STORAGE_BUCKET as an environment variable.`
  )
}

const app = express()

// Use pug
app.set("view engine", "pug")
app.set("views", "./src/appengine/views")

const storage = new Storage()
const bucket = storage.bucket(bucketName)

// .js is not included because JS files sometimes generate relative URLs
// based on the file path, which causes a 403 error when accessing the file
// from a signed URL.
const exts = ["css", "json", "xml", "txt", "md", "csv", "tsv"]

const threathold = 500 * 1024 // 500KB

/**
 * Root page.
 */
app.get("/", (req, res) => {
  renderIndexPage(req, res, { bucket })
})

/**
 * Route for other GET requests.
 */
app.get("/*", async (req, res) => {
  const name = req.path.substring(1) // remove heading slash char

  if (name !== "" && !name.endsWith("/")) {
    // Check if there is a file with the given file name
    const exactFile = bucket.file(name)
    const [exactFileExists] = await exactFile.exists()
    if (exactFileExists) {
      const ext = path.extname(name).substring(1)
      if (exts.includes(ext)) {
        const [metadata] = await exactFile.getMetadata()

        // If the file is a large blob file, generate a signed URL and redirect to it.
        if (metadata.size > threathold) {
          const [url] = await exactFile.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 60 * 1000, // 1 minutes
          })
          res.redirect(url)
          return
        }
      }

      renderSingleFile(exactFile, res)
      return
    }
  }

  // From this line, the `name` is considered as a directory name.

  // Check if there is a index.html in the directory.
  const indexFile = bucket.file(path.join(name, "index.html"))
  const [indexFileExists] = await indexFile.exists()
  if (indexFileExists) {
    renderSingleFile(indexFile, res)
    return
  }

  // Show all files in the directory.
  renderIndexPage(req, res, { bucket })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
