import React, { PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ConversationItem as DumbConversationItem } from '../components';
import NotificationSubscriber from './NotificationSubscriber';

class ConversationItem extends NotificationSubscriber {
  render() {
    const extendedProps = {
      ...this.props,
      notificationCount: this.props.data.unreadCount,
    };

    return <DumbConversationItem { ...extendedProps } />;
  }
}

ConversationItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(
  gql`
    query unreadCount($conversationId: String) {
      unreadCount(conversationId: $conversationId)
    }
  `,
  {
    options: (ownProps) => ({
      variables: { conversationId: ownProps.conversation._id },
    }),
  }
)(ConversationItem);
