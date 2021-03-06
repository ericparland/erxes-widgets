import React, { PropTypes, Component } from 'react';
import { ConversationItem, TopBar } from '../containers';


const propTypes = {
  conversations: PropTypes.array.isRequired,
  createConversation: PropTypes.func.isRequired,
  goToConversation: PropTypes.func.isRequired,
  color: PropTypes.string,
};

class ConversationList extends Component {
  render() {
    const {
      conversations,
      createConversation,
      goToConversation,
      color,
    } = this.props;

    const title = (
      <div className="erxes-topbar-title">
        <div>Conversations</div>
        <span>with Support staffs</span>
      </div>
    );

    return (
      <div className="erxes-messenger" style={{ border: `2px solid ${color}` }}>
        <TopBar
          middle={title}
          buttonClass="new"
          onButtonClick={createConversation}
        />
        <ul className="erxes-conversation-list">
          {
            conversations.map(conversation =>
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                goToConversation={goToConversation}
              />,
            )
          }
        </ul>
      </div>
    );
  }
}

ConversationList.propTypes = propTypes;

export default ConversationList;
