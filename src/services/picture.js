const MIME_TYPE = {
  PNG: 'image/png',
  JPG: 'image/jpg',
  JPEG: 'image/jpeg',
};

module.exports.mimeTypeToExtension = (mimetype) => {
  const mime_types = Object.values(MIME_TYPE);
  const extensions = Object.keys(MIME_TYPE);
  for(let i=0; i<mime_types.length; i++) {
    if(mime_types[i] === mimetype) {
      return extensions[i].toLowerCase();
    }
  }

  return null;
};

module.exports.availableMimeType = Object.values(MIME_TYPE);