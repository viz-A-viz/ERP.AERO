const path = require('node:path');
const fs = require('fs').promises;
const { BadRequest } = require('http-errors');
const { prisma } = require('./prisma.service');

class FileService {
  async saveFileProps(file, id) {
    if (!file) throw BadRequest('Файл не загружен');
    const ext = path.extname(file.originalname);
    const mime = file.mimetype;
    const { name } = path.parse(file.originalname);
    const size = file.size.toString();
    await prisma.file.upsert({
      where: { id: id || file.filename },
      update: { ext, mime, name, size, updated: new Date() },
      create: { ext, mime, name, size, id: id || file.filename },
    });
  }

  async getListOfFiles(list_size = 10, page = 1) {
    const filesList = await prisma.file.findMany({
      orderBy: { updated: 'desc' },
      take: list_size,
      skip: (page - 1) * list_size,
    });
    return filesList;
  }

  async deleteFile(id) {
    await fs.unlink(path.join(process.cwd(), '/public/files/', id));
    await prisma.file.delete({ where: { id } });
  }

  async info(id) {
    const file = await prisma.file.findFirst({ where: { id } });
    return file;
  }

  getFilePath(id) {
    const filePath = path.join(process.cwd(), '/public/files/', id);
    return filePath;
  }

  async getFileNameFromDB(id) {
    const file = await prisma.file.findFirst({ where: { id } });
    return file.name + file.ext;
  }

  async updateFile(file, id) {
    await fs.writeFile(
      path.join(process.cwd(), '/public/files/', id),
      file.buffer
    );
    await this.saveFileProps(file, id);
  }
}

exports.fileService = new FileService();
