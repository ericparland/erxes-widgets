import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { Message } from '../containers';
import { EngageMessage } from '../components';


const propTypes = {
  messages: PropTypes.array.isRequired,
  saveEmail: PropTypes.func,
  isOnline: PropTypes.bool,
  isObtainedEmail: PropTypes.bool,
  data: PropTypes.object,
};

class MessagesList extends Component {
  constructor(props) {
    super(props);


    this.renderMessage = this.renderMessage.bind(this);
  }

  componentDidMount() {
    this.node.scrollTop = this.node.scrollHeight;
  }

  componentWillUpdate() {
    const { node } = this;
    this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.node.scrollTop = this.node.scrollHeight;
    }
  }

  renderAwayMessage(messengerData) {
    const { isOnline } = this.props;
    if (messengerData && !isOnline && messengerData.awayMessage) {
      return (
        <li className="erxes-spacial-message away">
          {messengerData.awayMessage}
        </li>
      );
    }

    return null;
  }

  renderWelcomeMessage(messengerData) {
    const { isOnline } = this.props;
    if (messengerData && isOnline && messengerData.welcomeMessage) {
      return (
        <li className="erxes-spacial-message">
          {messengerData.welcomeMessage}
        </li>
      );
    }

    return null;
  }

  renderEmailPrompt() {
    if (!this.props.isObtainedEmail) {
      return (
        <li className="erxes-spacial-message ml50">
          <label htmlFor="visitor-email">Get notified</label>
          <div className="ask-email">
            <input id="visitor-email" placeholder="email@domain.com" />
            <button onClick={this.props.saveEmail} />
          </div>
        </li>
      );
    }

    return null;
  }

  renderMessage(message) {
    if (message.engageData && (message.engageData.kind === 'post' || message.engageData.kind === 'note')) {
      return (
        <div key={message._id} className="erxes-spacial-message">
          <EngageMessage engageData={message.engageData} />
        </div>
      );
    }

    return <Message key={message._id} {...message} />;
  }

  render() {
    const { data, messages } = this.props;
    const bg = data.uiOptions && data.uiOptions.wallpaper;
    const messengerData = data.messengerData;
    const messagesClasses = classNames('erxes-messages-list', { [`bg-${bg}`]: bg });
    console.log(messages);
    return (
      <ul
        className={messagesClasses}
        ref={(node) => { this.node = node; }}
      >
        {this.renderWelcomeMessage(messengerData)}
        {
          messages.map(message => this.renderMessage(message))
        }
        {this.renderAwayMessage(messengerData)}
        {this.renderEmailPrompt()}
      </ul>
    );
  }
}

MessagesList.propTypes = propTypes;

MessagesList.defaultProps = {
  isOnline: false,
  data: null,
};

export default MessagesList;
