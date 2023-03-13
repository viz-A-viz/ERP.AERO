const { fileService } = require('../services/file.service');

class FileController {
  async saveFileProps(req, res, next) {
    try {
      const { file } = req;
      await fileService.saveFileProps(file);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async getListOfFiles(req, res, next) {
    try {
      const { list_size, page } = req.body;
      const filesList = await fileService.getListOfFiles(list_size, page);
      res.json(filesList);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const { id } = req.params;
      await fileService.deleteFile(id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async info(req, res, next) {
    try {
      const { id } = req.params;
      const file = await fileService.info(id);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req, res, next) {
    try {
      const { id } = req.params;
      const filePath = fileService.getFilePath(id);
      const fileName = await fileService.getFileNameFromDB(id);
      res.download(filePath, fileName);
    } catch (error) {
      next(error);
    }
  }

  async updateFile(req, res, next) {
    try {
      const { file } = req;
      const { id } = req.params;
      await fileService.updateFile(file, id);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

exports.fileController = new FileController();
