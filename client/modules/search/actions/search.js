export default {
  setTeamUsersSearchText({LocalState}, searchText) {
    LocalState.set('teamUsersSearchText', searchText);
  },

  setAllUsersSearchText({LocalState}, searchText) {
    LocalState.set('allUsersSearchText', searchText);
  },

  clearSearchTexts({LocalState}) {
    LocalState.set('teamUsersSearchText', null);
    LocalState.set('allUsersSearchText', null);
  }
};
