

module.exports = function download(data, filename, mimeType) {
  mimeType = mimeType || 'application/octet-stream';

  let blob_data;

  if(/^data\:([\w\-]+\/[\w\-]+)?[,;]/.test(data)) {
    blob_data = dataURI2Blob(data);
    mimeType = blob_data.type || mimeType;
  } else if(data instanceof Blob) {
    blob_data = data;
  } else {
    blob_data = new Blob([ data ], { type: mimeType });
  }

  if(window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob_data, filename);
  } else if(window.URL) {
    save(window.URL.createObjectURL(blob_data), filename);
  }
}

function dataURI2Blob(data) {
  const parts = data.split(/[:;,]/);
  const type = parts[1];
  const decoder = parts[2] === 'base64' ? window.atob : window.decodeURIComponent;
  const bin_data = decoder(parts.pop());
  const length = bin_data.length;
  const uint = new Uint8Array(length);

  for(let i = 0; i < length; i++) {
    uint[i] = bin_data.charCodeAt(i);
  }

  return new Blob([ uint ], { type });
}

function save(url, filename) {
  const link = document.createElement('a');

  if('download' in link) {
    link.download = filename;
    link.style.display = 'none';
    link.href = url;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL && window.URL.revokeObjectURL(url);
    }, 10);
  } else {
    if(!window.open(url)) {
      if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) { 
        location.href = url;
      }
    }
  }
}