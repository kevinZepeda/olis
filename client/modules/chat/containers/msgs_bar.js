import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import ChatContainer from '../components/ChatContainer.jsx';
import R from 'ramda';
import {SubsManager} from 'meteor/meteorhacks:subs-manager';

const MsgSubs = new SubsManager();

export const depsMapper = (context, actions) => ({
  context: () => context,
  actions: () => actions,
  addMsg: actions.msgs.add,
  loadMore: actions.msgs.loadMore,
  translate: actions.translation.get,
  setNumVisibleMsgs: actions.msgs.setNumVisible
});

export const composer = ({context}, onData) => {
  const {Meteor, LocalState, Collections, FlowRouter} = context();
  const convoId = FlowRouter.getParam('convoId');

  // If you only see loading, make sure you added the collection to the index
  let msgs = [];
  const userId = Meteor.userId();
  const user = Meteor.user();
  const langCode = user ? user.translationLangCode : undefined;

  let convoUsers = {};
  let translations = {};
  let title = null;
  let usersListString = null;
  let convo;

  if (convoId) {
    const currentNumMsgs = LocalState.get(`loadMore.convo.${convoId}.numMsgs`) ?
      LocalState.get(`loadMore.convo.${convoId}.numMsgs`) : 0;

    // Subscribe
    const sub = MsgSubs.subscribe('msgs.list', {convoId, currentNumMsgs});
    if (sub.ready()) {
      const msgIds = LocalState.get('translation.msgIds') ? LocalState.get('translation.msgIds') : [];
      if (langCode) { MsgSubs.subscribe('translations.list', {msgIds, convoId, langCode}); }

      // Fetch
      const options = {sort: [ [ 'createdAt', 'asc' ] ]};
      msgs = Collections.Messages.find({convoId}, options).fetch();
      convo = Collections.Convos.findOne(convoId);
      if (convo) {
        const convoUsersArr = Meteor.users.find({_id: {$in: convo.userIds}}).fetch();
        convoUsers = R.zipObj(convoUsersArr.map(item => item._id), convoUsersArr);
        title = convo.name;

        usersListString = convoUsersArr.reduce((prev, curr, index) => {
          if (index > 0) { return `${prev}, ${curr.username}`; }
          return `${curr.username}`;
        }, '');
      }

      const transArr = Collections.Translations.find({convoId}).fetch();
      translations = R.zipObj(transArr.map(item => item.msgId), transArr);

      // Filter msgs to save render time
      const numVisibleMsgs = LocalState.get('msgs.numVisible') ?
        LocalState.get('msgs.numVisible') : 10;
      const msgsAfterThisOne = msgs[msgs.length - numVisibleMsgs] ?
        msgs[msgs.length - numVisibleMsgs] : msgs[0];
      msgs = R.filter(msg => msg.createdAt >= msgsAfterThisOne.createdAt, msgs);

      onData(null, {
        convo,
        msgs,
        userId,
        convoUsers,
        title,
        usersListString,
        langCode,
        translations,
        numVisibleMsgs
      });
    }
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ChatContainer);
