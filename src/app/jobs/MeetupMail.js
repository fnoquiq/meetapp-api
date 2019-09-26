import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class MeetupMail {
  get key() {
    return 'MeetupMail';
  }

  async handle({ data }) {
    const { subscription, meetup, user } = data;
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Inscrição de meetup',
      template: 'meetupMail',
      context: {
        subscription,
        meetup,
        user,
        date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new MeetupMail();
