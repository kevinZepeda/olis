import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import ChatContainer from '../components/ChatContainer.jsx';
import R from 'ramda';
import {SubsManager} from 'meteor/meteorhacks:subs-manager';
import {NEW_CONVO_VISIBLE} from '/lib/constants/msgs';

const MsgSubs = new SubsManager();

export const depsMapper = (context, actions) => ({
  context: () => context,
  actions: () => actions,
  addMsg: actions.msgs.add,
  loadMore: actions.msgs.loadMore,
  translate: actions.translation.get,
  incrementNumVisibleMsgs: actions.msgs.incrementNumVisible
});

export const composer = ({context}, onData) => {
  const {Meteor, LocalState, Collections, FlowRouter} = context();
  const convoId = FlowRouter.getParam('convoId');

  // If you only see loading, make sure you added the collection to the index
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
      const allMsgs = Collections.Messages.find({convoId}, options).fetch();
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
      const numVisibleMsgs = LocalState.get(`${convoId}.msgs.numVisible`) ?
        LocalState.get(`${convoId}.msgs.numVisible`) : NEW_CONVO_VISIBLE;
      const msgsAfterThisOne = allMsgs[allMsgs.length - numVisibleMsgs] ?
        allMsgs[allMsgs.length - numVisibleMsgs] : allMsgs[0];

      const isNewConvo = !LocalState.get(`${convoId}.msgs.visibleAfterDate`);

      // console.log(`-----------`);
      // console.log(`convoId from Router ${convoId} ${convo.name}`);
      // console.log(`${LocalState.get(`${convoId}.msgs.visibleAfterDate`)}`);
      // console.log(`isNewConvo ${isNewConvo}`);
      // console.log(`allMsgs[0] ${allMsgs[0] ? allMsgs[0].text : ''}`);
      // console.log(`msgsAfterThisOne ${msgsAfterThisOne.text}`);
      // console.log(`allMsgs ${allMsgs.length}, numVisibleMsgs ${numVisibleMsgs}`);

      if (isNewConvo) {
        LocalState.set(`${convoId}.msgs.visibleAfterDate`, msgsAfterThisOne.createdAt);
      } else {
        const visibleAfterDate = LocalState.get(`${convoId}.msgs.visibleAfterDate`);
        const xMsgFromBotIsNewer = msgsAfterThisOne.createdAt >= visibleAfterDate;
        if (xMsgFromBotIsNewer) {
          const msgs = R.filter(msg => msg.createdAt >= visibleAfterDate, allMsgs);
          // console.log(`msgs rendered ${msgs.length}`);
          
          onData(null, {
            convo,
            msgs,
            userId,
            convoUsers,
            title,
            usersListString,
            langCode,
            translations
          });
        } else {
          LocalState.set(`${convoId}.msgs.visibleAfterDate`, msgsAfterThisOne.createdAt);
        }
      }
    }
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ChatContainer);
