export default {
  'searchText.teamUsers.set'({LocalState}, searchText) {
    LocalState.set('searchText.teamUsers', searchText);
  },

  setAllUsersSearchText({LocalState}, searchText) {
    LocalState.set('searchText.allUsers', searchText);
  },

  'searchText.teamUsers.clear'({LocalState}) {
    LocalState.set('searchText.teamUsers', undefined);
  },

  'searchText.convoUsers.set'({LocalState}, searchText) {
    LocalState.set('searchText.convoUsers', searchText);
  },

  'searchText.convoUsers.clear'({LocalState}) {
    LocalState.set('searchText.convoUsers', undefined);
  },

  'searchText.team.all.set'({LocalState}, text) {
    LocalState.set('searchText.team.all', text);
  },

  'select.convo'({FlowRouter}, convoId) {
    const teamId = FlowRouter.getParam('teamId');
    FlowRouter.go(`/team/${teamId}/convo/${convoId}`);
  },

  'select.user'({FlowRouter}, userId) {
    // TODO go to your private convo with them.
    // What if you don't have one? Start one.
  },

  'select.msg'({FlowRouter}, convoId, msgId) {
    const teamId = FlowRouter.getParam('teamId');
    FlowRouter.go(`/team/${teamId}/convo/${convoId}/msg/${msgId}`);
  }
};
