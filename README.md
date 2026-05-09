# File Upload + Linker

A single-page web app that allows a user to upload _any_ file to a **Google Cloud Storage** bucket, and receive a public download link.

**Live Demo Site:** [nickcyran.github.io/ICSI518-Project-2](https://nickcyran.github.io/ICSI518-Project-2/)

---

## How It Works

1. The user selects a file via the file input and clicks **Upload**.
2. The filename is discarded; a new unique name is generated using the current timestamp and a `crypto.randomUUID()`.
3. The file is sent directly from the browser to a **Google Cloud Storage** bucket using the [upload API](https://cloud.google.com/storage/docs/uploading-objects) with `uploadType=media`.
4. If the upload is a success, a public download link is returned to the user. If it fails, an error message is shown.

---

## Implementation

### `index.html`
Minimal html with three main elements:
- `<input type="file">`: lets the user select any file on their device.
- `<button>`: triggers the upload.
- `<div id="status">`: displays link/error after upload attempt.

### `script.js`


| Function | Description |
|---|---|
| `handleUpload()` | Validates input, constructs the object name, posts the file, and renders the result |
| `setUploading(bool)` | Enables/disables the button and shows a loading state during the request |
| `showStatus(ok, html)` | Injects a success or error message into the status div |

**Details:**
- Files are uploaded as raw bytes (`uploadType=media`) with it's original `Content-Type` preserved.
- The object name format is `[timestamp]_[uuid].[extension]`.
- The public URL follows the pattern: `https://storage.googleapis.com/<bucket>/<objectName>`
- The **Google Cloud Storage** bucket (`icsi-518-project-2`) must have **uniform public read access** enabled so the links can be accessible without further authentication.

---