import {check} from 'meteor/check';
import R from 'ramda';

export default function ({Meteor, Collections, Models}) {
  const MSGS_ADD = 'msgs.add';
  Meteor.methods({
    'msgs.add'({text, convoId}) {
      check(arguments[0], {
        text: String,
        convoId: String
      });

      const userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error(MSGS_ADD, 'Must be logged in to insert msgs.');
      }
      const user = Meteor.user();

      const convo = Collections.Convos.findOne(convoId);
      if (!convo) {
        throw new Meteor.Error(MSGS_ADD, 'Must post messages to an existing convo.');
      }
      if (!convo.isUserInConvo(userId)) {
        throw new Meteor.Error(MSGS_ADD, 'Must be a part of convo to add msgs');
      }

      const msg = new Models.Message();
      msg.set({text, userId, username: user.username, convoId, convoName: convo.name});
      msg.save();

      // Update convo with last msg text
      const uniqueRecentUserIds = R.uniq(convo.recentUserIds);
      const oldRecentUserIds = uniqueRecentUserIds.length >= 2 ?
        R.takeLast(2, uniqueRecentUserIds) : R.takeLast(2, convo.userIds);

      const recentUserIds = R.takeLast(2, R.uniq([ ...oldRecentUserIds, userId ]));
      const recentUsers = Meteor.users.find({_id: {$in: recentUserIds}});
      const recentUsernames = recentUsers.map(recentUser => recentUser.username);

      convo.set({
        lastMsgText: text,
        recentUserIds,
        recentUsernames
      });
      convo.save();
    }
  });
}
