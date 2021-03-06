/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import { MESSAGE_ACTIONS } from '../../utils';
import { withTranslationContext } from '../../context';

/**
 * MessageActionsBox - A component for taking action on a message
 *
 * @example ../../docs/MessageActionsBox.md
 * @extends PureComponent
 */
class MessageActionsBox extends React.Component {
  static propTypes = {
    /** If the message actions box should be open or not */
    open: PropTypes.bool.isRequired,
    /**
     * @deprecated
     *
     *  The message component, most logic is delegated to this component and MessageActionsBox uses the following functions explicitly:
     *  `handleFlag`, `handleMute`, `handleEdit`, `handleDelete`, `canDeleteMessage`, `canEditMessage`, `isMyMessage`, `isAdmin`
     */
    Message: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
    /** If message belongs to current user. */
    mine: PropTypes.bool,
    /** DOMRect object for parent MessageList component */
    messageListRect: PropTypes.object,
    /**
     * Handler for flaging a current message
     *
     * @param event React's MouseEventHandler event
     * @returns void
     * */
    handleFlag: PropTypes.func,
    /**
     * Handler for muting a current message
     *
     * @param event React's MouseEventHandler event
     * @returns void
     * */
    handleMute: PropTypes.func,
    /**
     * Handler for editing a current message
     *
     * @param event React's MouseEventHandler event
     * @returns void
     * */
    handleEdit: PropTypes.func,
    /**
     * Handler for deleting a current message
     *
     * @param event React's MouseEventHandler event
     * @returns void
     * */
    handleDelete: PropTypes.func,
    /**
     * Returns array of avalable message actions for current message.
     * Please check [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message.js) component for default implementation.
     */
    getMessageActions: PropTypes.func,
  };

  static defaultProps = {
    open: false,
  };

  actionsBoxRef = React.createRef();

  state = {
    reverse: false,
    rect: null,
  };

  componentDidMount() {}

  async componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      if (this.state.rect === null) {
        await this.setState({
          rect: this.actionsBoxRef.current.getBoundingClientRect(),
        });
      }
      const ml = this.props.messageListRect;

      if (this.props.mine) {
        this.setState({
          reverse: this.state.rect.left < ml.left ? true : false,
        });
      } else if (!this.props.mine) {
        this.setState({
          reverse: this.state.rect.right + 5 > ml.right ? true : false,
        });
      }
    }
  }

  render() {
    const {
      handleFlag,
      handleMute,
      handleEdit,
      handleDelete,
      getMessageActions,
      t,
      isUserMuted,
    } = this.props;
    const messageActions = getMessageActions();
    return (
      <div
        data-testid="message-actions-box"
        className={`str-chat__message-actions-box
          ${this.props.open ? 'str-chat__message-actions-box--open' : ''}
          ${this.props.mine ? 'str-chat__message-actions-box--mine' : ''}
          ${this.state.reverse ? 'str-chat__message-actions-box--reverse' : ''}
        `}
        ref={this.actionsBoxRef}
      >
        <ul className="str-chat__message-actions-list">
          {messageActions.indexOf(MESSAGE_ACTIONS.flag) > -1 && (
            <button onClick={handleFlag}>
              <li className="str-chat__message-actions-list-item">
                {t('Flag')}
              </li>
            </button>
          )}
          {messageActions.indexOf(MESSAGE_ACTIONS.mute) > -1 && (
            <button onClick={handleMute}>
              <li className="str-chat__message-actions-list-item">
                {isUserMuted() ? t('Unmute') : t('Mute')}
              </li>
            </button>
          )}
          {messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1 && (
            <button onClick={handleEdit}>
              <li className="str-chat__message-actions-list-item">
                {t('Edit Message')}
              </li>
            </button>
          )}
          {messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1 && (
            <button onClick={handleDelete}>
              <li className="str-chat__message-actions-list-item">
                {t('Delete')}
              </li>
            </button>
          )}
        </ul>
      </div>
    );
  }
}

export default withTranslationContext(MessageActionsBox);
