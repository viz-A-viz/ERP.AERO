const { Router } = require('express');
const multer = require('multer');
const { fileController } = require('../controllers/file.controller');

const upload = multer({ dest: 'public/files/' });
const update = multer({ storage: multer.memoryStorage() });

const fileRoute = Router();

fileRoute
  .post('/upload', upload.single('file'), fileController.saveFileProps)
  .get('/list', fileController.getListOfFiles)
  .delete('/delete/:id', fileController.deleteFile)
  .get('/:id', fileController.info)
  .get('/download/:id', fileController.downloadFile)
  .put('/update/:id', update.single('file'), fileController.updateFile);

module.exports = { fileRoute };
