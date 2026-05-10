# Secure File Upload + Linker

A web app that lets a user upload _any_ file to a **Google Cloud Storage** bucket and receive a shareable download link (valid for 7 days). Both upload and download links go through cryptographically **signed URLs**, so the bucket is not public.

**Live Demo:** [nickcyran.github.io/ICSI518-Project-2](https://nickcyran.github.io/ICSI518-Project-2/)

---

## How It Works
1. User picks a file and clicks **Upload**.
2. Browser asks the backend for a **signed upload URL**.
3. Browser uploads the file to GCS.
4. Backend generates a **signed download URL** (valid for 7 days) and returns it.

The object name is generated on the **server** as `[timestamp]_[uuid].[ext]`; client can't choose the name, so original filename is discarded. 

---

## Added security features
The initial implementation lacked any security features. While the program worked to upload files to GCS and return a download link access to the bucket was public to allusers. This seemed to be vunerable so there is now a backend that handles upload/download.

| Concern | Before | After |
|---|---|---|
| Bucket reads | Bucket is public; anyone could download | Bucket is private; only signed URLs work |
| Bucket writes | Anyone could upload | Only backend can sign upload URLs |
| Content type | Trusted from the client | Locked into the signed URL |
| Link lifespan | Forever | 7 days (v4 max) |

---

## Project Structure

```
.
├── server.js          # Backend (Express + Google cloud storage)
├── package.json
├── public/            # Frontend (deployed on GitHub Pages)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── .github/workflows/
    └── pages.yml      # Deploys ./public to Github Pages
```

---

## Architecture

- **Frontend:** GitHub Pages --> `https://nickcyran.github.io/ICSI518-Project-2/`
- **Backend:** Google Cloud Run --> `https://secure-upload-api-182043447480.us-central1.run.app`
- **Storage:** _Private_ Google Cloud Storage bucket --> `icsi-518-project-2`.

---

## API

| Endpoint | Body | Returns |
|---|---|---|
| `POST /api/get-upload-url` | `{ contentType }` | `{ uploadUrl, objectName }` - signed PUT URL, 15 min |
| `POST /api/get-download-url` | `{ objectName }` | `{ downloadUrl }` - signed GET URL, 7 days |

---
## Supported File Types
All major file types work!

| Category | Examples |
|---|---|
| Images | `.png`, `.jpg`, `.gif`, `.webp`, `.svg` |
| Documents | `.pdf`, `.docx`, `.xlsx`, `.pptx` |
| Text & code | `.txt`, `.md`, `.json`, `.js`, `.py`, `.html` |
| Archives | `.zip`, `.rar`, `.7z` |
| Audio & video | `.mp3`, `.mp4`, `.mov`, `.wav` |
| Executables | `.exe`, `.msi`, `.deb` |

_**NOTE:** Files with no extension are stored as `.bin`._
