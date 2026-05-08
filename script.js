// - [config] ---------------------------------------------------
const BUCKET_NAME = 'icsi-518-project-2';
const UPLOAD_URL = `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o`;
const PUBLIC_URL = `https://storage.googleapis.com/${BUCKET_NAME}`;

// - [references] -----------------------------------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadButton');
const statusDiv = document.getElementById('status');


uploadBtn.addEventListener('click', handleUpload);

async function handleUpload() {
    const file = fileInput.files[0];

    // user must select a file to upload
    if (!file)
        return alert('Please select a file first.');

    // avoid collisions by adding timestamp to the stored file name
    const objectName = encodeURIComponent(`${Date.now()}_${file.name}`);

    setUploading(true);

    try {
        // upload the file to the Google Cloud service as raw bytes
        const res = await fetch(`${UPLOAD_URL}?uploadType=media&name=${objectName}`, {
            method: 'POST',
            headers: file.type ? { 'Content-Type': file.type } : {},
            body: file,
        });

        // upload succes ? return download link : return error
        const link = `${PUBLIC_URL}/${objectName}`;
        showStatus(
            res.ok,
            res.ok
                ? `<strong>Upload successful!</strong> Download link: <a href="${link}" target="_blank">${link}</a>`
                : `<strong>Upload failed.</strong> ${await res.text()}`
        );
    } catch {
        showStatus('error', 'Network error.');
    } finally {
        setUploading(false);
    }
}

// - [helpers] ----------------------------------------------------
function setUploading(isUploading) {
    // enable/disable button based on upload status
    uploadBtn.disabled = isUploading;
    uploadBtn.textContent = isUploading ? 'Uploading...' : 'Upload';
    if (isUploading) statusDiv.style.display = 'none';
}

function showStatus(wasSuccessful, html) {
    statusDiv.className = wasSuccessful ? 'success' : 'error';
    statusDiv.innerHTML = html;
    statusDiv.style.display = 'block';
}