import React, { useCallback, useState } from 'react';

import {
  MESSAGE_ACTIONS,
  useChannelActionContext,
  useMessageContext,
  useTranslationContext,
} from 'stream-chat-react';

const UnMemoizedMessageActionsBox = (
  props: any,
) => {
  const {
    getMessageActions,
    handleDelete,
    handleEdit,
    handleFlag,
    handleMute,
    handlePin,
    isUserMuted,
    mine,
    open = false,
  } = props;

  const { setQuotedMessage } = useChannelActionContext(
    'MessageActionsBox',
  );
  const { message, messageListRect } = useMessageContext('MessageActionsBox');

  const { t } = useTranslationContext('MessageActionsBox');

  const [reverse, setReverse] = useState(false);

  const messageActions = getMessageActions();

  const checkIfReverse = useCallback(
    (containerElement: HTMLDivElement) => {
      if (!containerElement) {
        setReverse(false);
        return;
      }

      if (open) {
        const containerRect = containerElement.getBoundingClientRect();

        if (mine) {
          setReverse(!!messageListRect && containerRect.left < messageListRect.left);
        } else {
          setReverse(!!messageListRect && containerRect.right + 5 > messageListRect.right);
        }
      }
    },
    [messageListRect, mine, open],
  );

  const handleQuote = () => {
    setQuotedMessage(message);

    const elements = message.parent_id
      ? document.querySelectorAll('.str-chat__thread .str-chat__textarea__textarea')
      : document.getElementsByClassName('str-chat__textarea__textarea');
    const textarea = elements.item(0);

    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
  };

  return (
    <div
      className={`str-chat__message-actions-box
        ${open ? 'str-chat__message-actions-box--open' : ''}
        ${mine ? 'str-chat__message-actions-box--mine' : ''}
        ${reverse ? 'str-chat__message-actions-box--reverse' : ''}
      `}
      data-testid='message-actions-box'
      ref={checkIfReverse}
    >
      <div aria-label='Message Options' className='str-chat__message-actions-list' role='listbox'>
        {/* {messageActions.indexOf(MESSAGE_ACTIONS.quote) > -1 && !message.quoted_message && ( */}
        {messageActions.indexOf(MESSAGE_ACTIONS.quote) > -1 && !message.quoted_message && !mine && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handleQuote}
            role='option'
          >
            {t('Reply')}
          </button>
        )}
        {messageActions.indexOf(MESSAGE_ACTIONS.pin) > -1 && !message.parent_id && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handlePin}
            role='option'
          >
            {!message.pinned ? t('Pin') : t('Unpin')}
          </button>
        )}
        {messageActions.indexOf(MESSAGE_ACTIONS.flag) > -1 && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handleFlag}
            role='option'
          >
            {t('Flag')}
          </button>
        )}
        {messageActions.indexOf(MESSAGE_ACTIONS.mute) > -1 && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handleMute}
            role='option'
          >
            {isUserMuted() ? t('Unmute') : t('Mute')}
          </button>
        )}
        {messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1 && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handleEdit}
            role='option'
          >
            {t('Edit Message')}
          </button>
        )}
        {messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1 && (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item'
            onClick={handleDelete}
            role='option'
          >
            {t('Delete')}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * A popup box that displays the available actions on a message, such as edit, delete, pin, etc.
 */
export const CustomActionsBox = React.memo(
  UnMemoizedMessageActionsBox,
) as typeof UnMemoizedMessageActionsBox;
