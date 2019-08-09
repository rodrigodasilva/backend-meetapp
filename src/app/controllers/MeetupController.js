import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      // order: ['date'],
      include: [User],
      /**
       * Configurações de paginação
       */
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup) {
      return res.json({ error: "Meetup don't exists" });
    }

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user_id = req.userId;
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'User not authorized.' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup date has passed' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'User not authorized.' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup date has passed' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
