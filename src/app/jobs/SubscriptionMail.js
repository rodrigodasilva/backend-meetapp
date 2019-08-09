import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

/**
 * Job responsável por enviar um email ao organizador sempre que houver
 * uma nova inscrição no seu meetupp
 */

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { user, meetup, createdAt } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `Nova Inscrição [${meetup.title}]`,
      template: 'subscription',
      context: {
        organizer: meetup.User.name,
        title: meetup.title,
        user: user.name,
        email: user.email,
        meetupDate: format(
          parseISO(meetup.date),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        subscriptionDate: format(
          parseISO(createdAt),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new SubscriptionMail();
