import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async show(req, res) {
    const { path } = req.params;

    const file = await File.findOne({ where: { path } });

    return res.status(200).json(file);
  }
}

export default new FileController();
