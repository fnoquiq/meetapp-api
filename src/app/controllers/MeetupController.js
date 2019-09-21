import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
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
