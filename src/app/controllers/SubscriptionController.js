import { isBefore } from 'date-fns';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const user_id = req.userId;
    const meetup_id = req.params.meetupId;

    const meetup = await Meetup.findByPk(meetup_id);

    if (meetup.user_id === user_id) {
      return res
        .status(400)
        .json({ error: "You can't subscribe in your own meetup" });
    }

    if (isBefore(meetup.date, new Date())) {
      return res
        .status(400)
        .json({ error: "You can't subscribe on past meetups" });
    }

    const isSubscribe = await Meetup.findOne({
      where: {
        meetup_id,
        user_id,
      },
    });

    if (isSubscribe !== null) {
      return res
        .status(400)
        .json({ error: 'You already subscribe this meetup' });
    }

    const subscription = await Subscription.create({
      user_id,
      meetup_id,
    });

    return res.json(subscription);
  }

  async index(req, res) {
    return res.json({ ok: 'true' });
  }
}

export default new SubscriptionController();
