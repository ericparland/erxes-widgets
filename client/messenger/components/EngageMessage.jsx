import React, { PropTypes } from 'react';
import striptags from 'striptags';
import { User } from '../components';
import { togglePopup } from '../actions/messenger';

const propTypes = {
  engageData: PropTypes.object,
};

class EngageMessage extends React.Component {
  onClickPopup() {
    togglePopup();
  }

  renderNotificationContent() {
    const { content, sentAs, fromUser, kind } = this.props.engageData;
    const bodyClass = `notification-body ${sentAs}`;

    if (sentAs === 'badge') {
      return null;
    }

    const notificationBody = (
      <div className="flex-notification">
        <div className="user-info">
          <User user={fromUser} />
          {fromUser.details.fullName}
        </div>
        <div className={bodyClass}>
          {
            sentAs === 'fullMessage' ?
              <span dangerouslySetInnerHTML={{ __html: content }} /> :
              striptags(content)
          }
        </div>
      </div>
    );

    if (kind === 'post') {
      return (
        <div className="popup-handler" onClick={this.onClickPopup}>
          {notificationBody}
        </div>
      );
    }

    return notificationBody;
  }

  render() {
    return this.renderNotificationContent();
  }
}

EngageMessage.propTypes = propTypes;

export default EngageMessage;
