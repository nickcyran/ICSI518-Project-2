// - [config] ---------------------------------------------------
const API_BASE = location.hostname === 'localhost' ? '' : 'https://secure-upload-api-182043447480.us-central1.run.app';

// - [references] -----------------------------------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadButton');
const statusDiv = document.getElementById('status');


uploadBtn.addEventListener('click', handleUpload);

async function handleUpload() {
    const file = fileInput.files[0];

    // user must select a file to upload
    if (!file)
        return alert('Please select a file first!');

    setUploading(true);

    try {
        const contentType = file.type || 'application/octet-stream';

        // 1. get upload url from the backend
        const { uploadUrl, objectName } = await postJSON('/api/get-upload-url', { contentType });

        // 2. upload the file to the Google Cloud Storage bucket
        const putRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
        });

        if (!putRes.ok) 
            throw new Error(`Upload failed (${putRes.status})`);

        // 3. get a download url that can be shared (valid for 7 days)
        const { downloadUrl } = await postJSON('/api/get-download-url', { objectName });

        showStatus(true,
            `<strong>Upload successful!</strong><br>
             Download Link: <a href="${downloadUrl}" target="_blank" rel="noopener" class="dl-link">${downloadUrl}</a>
             <br><small>Link is valid for 7 days.</small>`
        );
    } catch (err) {
        console.error(err);
        showStatus(false, `<strong>Upload failed.</strong> ${err.message}`);
    } finally {
        setUploading(false);
    }
}

// - [helpers] ----------------------------------------------------
async function postJSON(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok)
        throw new Error(`Request failed (${res.status})`);
    return res.json();
}

function setUploading(isUploading) {
    uploadBtn.disabled = isUploading;
    uploadBtn.textContent = isUploading ? 'Uploading...' : 'Upload';
    if (isUploading) statusDiv.style.display = 'none';
}

function showStatus(wasSuccessful, html) {
    statusDiv.className = wasSuccessful ? 'success' : 'error';
    statusDiv.innerHTML = html;
    statusDiv.style.display = 'block';
}