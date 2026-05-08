// - [references] -----------------------------------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadButton');
const statusDiv = document.getElementById('status');


uploadBtn.addEventListener('click', handleUpload);

async function handleUpload() {
  const file = fileInput.files[0];

  // user MUST upload a file
  if (!file) 
    return alert('Please select a file first.');

  setUploading(true);

}

// - [helpers] ----------------------------------------------------
function setUploading(isUploading) {
  uploadBtn.disabled = isUploading;
  uploadBtn.textContent = isUploading ? 'Uploading...' : 'Upload';
  
  if (isUploading) 
    statusDiv.style.display = 'none';
}
