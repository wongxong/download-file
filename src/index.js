

module.exports = function download(data, filename, mimeType) {
  mimeType = mimeType || 'application/octet-stream';

  let blob_data;

  if(/^data\:([\w\-]+\/[\w\-]+)?[,;]/.test(data)) {
    // 如果是 dataURI 格式的数据，转换成 blob 数据
    blob_data = dataURI2Blob(data);
    mimeType = blob_data.type || mimeType;
  } else if(data instanceof Blob) {
    blob_data = data;
  } else {
    // 如果是其他数据格式 字符串 / ArrayBuffer / Uint8Array ...
    blob_data = new Blob([ data ], { type: mimeType });
  }

  if(window.navigator.msSaveBlob) {
    // 如果是 IE10, IE10 不支持 a.download 
    window.navigator.msSaveBlob(blob_data, filename);
  } else if(window.URL) {
    // 直接 save
    save(window.URL.createObjectURL(blob_data), filename);
  }
}

function dataURI2Blob(data) {
  // dataURI 转换成 Blob 数据
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
    // 如果支持 a.download html5 
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
    // 如果不支持 a.download , 直接认定是 safari 浏览器
    if(!window.open(url)) {
      // 如果 popup 被 blocked, 直接由用户确认是否在当前页面下载成功后返回
      if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) { 
        location.href = url;
      }
    }
  }
}