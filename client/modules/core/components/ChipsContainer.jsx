import React from 'react';
import R from 'ramda';
import PeopleIcon from 'material-ui/lib/svg-icons/social/people';
import Chip from '/client/modules/core/components/Chip.jsx';

export default class ChipsContainer extends React.Component {
  renderChips() {
    const {usersToAdd, removeUserId} = this.props;
    return usersToAdd.map( user => {
      return (
        <div key={user._id} style={{marginBottom: '6px'}}>
          <Chip
            // NOTE: avatarSrc is optional, Chip can generate an avatar w/ the username alone
            avatarSrc={user.profileImageUrl}
            username={user.displayName}
            onRemoveClick={removeUserId.bind(null, user._id)}
          />
        </div>
      );
    });
  }

  render() {
    const {usersToAdd} = this.props;
    if (R.isEmpty(usersToAdd)) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          color: '#aaa',
          padding: '16px',
        }}>
          <PeopleIcon
            style={{width: '64px', height: '64px'}}
            color="#aaa"
          />
          <h5>Selected participants will appear here!</h5>
        </div>
      );
    }
    return (
      <div style={{padding: '12px'}}>
        { this.renderChips() }
      </div>
    );
  }
}
ChipsContainer.defaultProps = {
  usersToAdd: [],
  removeUser(userId = 'someFakeId') { console.log(`Remove user with ${userId}`); }
};
