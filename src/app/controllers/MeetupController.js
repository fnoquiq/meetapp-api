import { parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      bannerId: Yup.number().required(),
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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      bannerId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(401).json({
        error: "You can only update meetups that haven't happened yet",
      });
    }

    const { id } = req.params;
    const meetup = await Meetup.findByPk(id);

    if (meetup === null || meetup === undefined) {
      return res.status(400).json({
        error: 'Meetup not found',
      });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: "You can't access this meetup" });
    }

    const updatedMeetup = await meetup.update(req.body);

    return res.json(updatedMeetup);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      attributes: ['id', 'date', 'title', 'description', 'location'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new MeetupController();
