import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import File from '../models/File';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          include: [
            {
              model: File,
              as: 'banner',
            },
            {
              model: User,
            },
          ],
        },
      ],
      order: [[Meetup, 'date', 'ASC']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const meetup = await Meetup.findByPk(req.params.id, {
      include: [User],
    });

    if (!meetup) {
      return res.json({ error: "Meetup don't exists" });
    }

    /**
     * Check if it's your own meetup
     */
    if (meetup.user_id === user.id) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    /**
     * Check if meetup has already happened
     */
    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup date has passed' });
    }

    /**
     * Check if he already has a meeting on this date
     */
    const availableDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (availableDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    const { createdAt } = subscription;

    await Queue.add(SubscriptionMail.key, {
      user,
      meetup,
      createdAt,
    });

    const returnSubscriptionWithMeetup = await Subscription.findOne({
      where: { id: subscription.id },
      include: [
        {
          model: Meetup,
        },
      ],
    });

    return res.json(returnSubscriptionWithMeetup);
  }

  async delete(req, res) {
    const subscription = await Subscription.findByPk(req.params.id);

    await subscription.destroy();

    return res.send();
  }
}

export default new SubscriptionController();
