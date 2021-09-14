const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'djdyqvpes' || process.env.CLOUD_NAME,
    api_key: '141418565257631' || process.env.CLOUDINARY_API_KEY,
    api_secret: 'p1rUWOTQ7mXVxd82aaBJapIGxd8' || process.env.CLOUDINARY_SECRET_KEY
  });

  exports.uploads = (file, folder) => {
      return new Promise(resolve => {
          cloudinary.uploader.upload(file, (result) => {
              resolve({
                  url: result.url,
                  id: result.public_id
              })
          }, {
              resource_type : "auto",
              folder: folder
          })
      })
  }