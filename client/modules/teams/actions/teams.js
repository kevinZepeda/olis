import TeamUtils from '/client/modules/core/libs/teams';
import R from 'ramda';
import EmailValidator from 'email-validator';

export default {
  add({Meteor, LocalState}, name, userIds) {
    Meteor.call('teams.add.withShadow', {name, userIds}, (err, teamId) => {
      if (err) { alert(err); }
      else { TeamUtils.select({Meteor, LocalState}, teamId); }
    });
  },

  select({FlowRouter}, teamId) {
    FlowRouter.go(`/team/${teamId}`);
  },

  addMembers({Meteor, LocalState}, teamId, userIds) {
    Meteor.call('teams.addMembers.withShadow', {teamId, userIds}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  },

  goToManageTeams({FlowRouter}) {
    FlowRouter.go('/teams');
  },

  goToTeamSettings({FlowRouter}) {
    const teamId = FlowRouter.getParam('teamId');
    const convoId = FlowRouter.getParam('convoId');

    if (convoId) { FlowRouter.go(`/team/${teamId}/convo/${convoId}/settings`); }
    else { FlowRouter.go(`/team/${teamId}/settings`); }
  },

  goToTeamSettingsFromManageTeams({FlowRouter}, teamId) {
    FlowRouter.go(`/team/${teamId}/settings`);
  },

  setName({Meteor, FlowRouter}, name) {
    const teamId = FlowRouter.getParam('teamId');
    Meteor.call('teams.setName', {teamId, name}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  },

  setInfo({Meteor, FlowRouter}, info) {
    const teamId = FlowRouter.getParam('teamId');
    Meteor.call('teams.setInfo', {teamId, info}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  },

  setUserRole({Meteor, FlowRouter}, userId, role) {
    const teamId = FlowRouter.getParam('teamId');
    Meteor.call('teams.setUserRole', {teamId, changeUserId: userId, role}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  },

  invite({Meteor, LocalState, FlowRouter}, inviteEmails, callback) {
    const teamId = FlowRouter.getParam('teamId');
    try {
      let numNonEmpty = 0;
      inviteEmails.forEach(email => {
        if (!EmailValidator.validate(email) && !R.isEmpty(email)) {
          throw new Meteor.Error('actions.teams.invite', 'Enter proper emails.');
        }

        if (!R.isEmpty(email)) { numNonEmpty++; }
        if (numNonEmpty === 0) {
          throw new Meteor.Error('actions.teams.invite', 'Enter at least one email.');
        }
      });

      Meteor.call('teams.invite.withShadow', {inviteEmails, teamId}, (err, res) => {
        if (err) { alert(err); }
        else {
          console.log(res);
          if (callback) { callback(); }
        }
      });
    }
    catch (e) { alert(e); }
  },

  setUserIdShown({LocalState}, userId) {
    LocalState.set('teamDirectory.userIdShown', userId);
  },

  makeUserAdmin({Meteor, FlowRouter}, userId) {
    const teamId = FlowRouter.getParam('teamId');
    Meteor.call('teams.setUserRole', {teamId, changeUserId: userId, role: 'admin'}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  },

  removeUser({Meteor, FlowRouter}, userId) {
    const teamId = FlowRouter.getParam('teamId');
    Meteor.call('teams.removeUser', {teamId, removeUserId: userId}, (err, res) => {
      if (err) { alert(err); }
      else { console.log(res); }
    });
  }
};
