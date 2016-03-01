import React from 'react';
import R from 'ramda';

import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';

export default class NotificationList extends React.Component {

  _renderHighlightText(props) {
    return (
      <span style={{color: '#00bcd4'}}>
        {props.children}
      </span>
    );
  }

  _renderSecondaryText(recentUsers) {
    const HighlightText = this._renderHighlightText;

    const pluralUsers = (numUsers) => {
      if (numUsers > 1) {
        return <span> and <HighlightText>{numUsers - 1} others</HighlightText></span>;
      }
    };

    return (
      <span><HighlightText>{ R.last(recentUsers) }</HighlightText>
        { pluralUsers(recentUsers.length) }
        <span> {recentUsers.length > 1 ? 'have' : 'has'} replied to the conversation.</span>
      </span>
    );
  }

  handleClick(teamId, convoId) {
    this.props.clickNotification(teamId, convoId);
    this.props.closePopoverFunction();
  }

  render() {
    const { notifications, closePopoverFunction } = this.props;

    if (notifications.length === 0) {
      return <ListItem primaryText="No new notifications" onClick={closePopoverFunction}/>;
    }

    return (
      <div>
        {
          notifications.map(notif => {
            return (
              <ListItem
                key={ notif._id }
                primaryText={ notif.convoName }
                secondaryText={ this._renderSecondaryText.bind(this, notif.recentUsernames)() }
                leftAvatar={ <Avatar src="https://www.placecage.com/100/100" /> }
                onTouchTap={ this.handleClick.bind(this, notif.teamId, notif.convoId) }
              />
            );
          })
        }
      </div>
    );
  }
}
NotificationList.defaultProps = {
  notifications: []
};
