import { parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date, bannerId } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(401).json({
        error: 'You can only registrer meetups in a future dates',
      });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id: bannerId,
      user_id: req.userId,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
