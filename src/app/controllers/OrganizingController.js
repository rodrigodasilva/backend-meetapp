import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingCrontroller {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAndCountAll({
      where: { user_id: req.userId },
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
      order: [['date', 'ASC']],

      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(meetups);
  }
}

export default new OrganizingCrontroller();
