import type { Reducer } from 'react';
import type { Channel, MessageResponse, ChannelState as StreamChannelState } from 'stream-chat';

import type { ChannelState, StreamMessage } from '../../context/ChannelStateContext';

import type { DefaultStreamChatGenerics } from '../../types/types';

export type ChannelStateReducerAction<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> =
  | {
      type: 'closeThread';
    }
  | {
      channel: Channel<StreamChatGenerics>;
      type: 'copyMessagesFromChannel';
      parentId?: string | null;
    }
  | {
      channel: Channel<StreamChatGenerics>;
      type: 'copyStateFromChannelOnEvent';
    }
  | {
      channel: Channel<StreamChatGenerics>;
      type: 'initStateFromChannel';
    }
  | {
      hasMore: boolean;
      messages: StreamMessage<StreamChatGenerics>[];
      type: 'loadMoreFinished';
    }
  | {
      threadHasMore: boolean;
      threadMessages: Array<ReturnType<StreamChannelState<StreamChatGenerics>['formatMessage']>>;
      type: 'loadMoreThreadFinished';
    }
  | {
      channel: Channel<StreamChatGenerics>;
      message: StreamMessage<StreamChatGenerics>;
      type: 'openThread';
    }
  | {
      error: Error;
      type: 'setError';
    }
  | {
      loadingMore: boolean;
      type: 'setLoadingMore';
    }
  | {
      message: StreamMessage<StreamChatGenerics>;
      type: 'setThread';
    }
  | {
      channel: Channel<StreamChatGenerics>;
      type: 'setTyping';
    }
  | {
      type: 'startLoadingThread';
    }
  | {
      channel: Channel<StreamChatGenerics>;
      message: MessageResponse<StreamChatGenerics>;
      type: 'updateThreadOnEvent';
    };

export type ChannelStateReducer<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = Reducer<ChannelState<StreamChatGenerics>, ChannelStateReducerAction<StreamChatGenerics>>;

export const channelReducer = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  state: ChannelState<StreamChatGenerics>,
  action: ChannelStateReducerAction<StreamChatGenerics>,
) => {
  switch (action.type) {
    case 'closeThread': {
      return {
        ...state,
        thread: null,
        threadLoadingMore: false,
        threadMessages: [],
      };
    }

    case 'copyMessagesFromChannel': {
      const { channel, parentId } = action;
      return {
        ...state,
        messages: [...channel.state.messages],
        pinnedMessages: [...channel.state.pinnedMessages],
        threadMessages: parentId
          ? { ...channel.state.threads }[parentId] || []
          : state.threadMessages,
      };
    }

    case 'copyStateFromChannelOnEvent': {
      const { channel } = action;
      return {
        ...state,
        members: { ...channel.state.members },
        messages: [...channel.state.messages],
        pinnedMessages: [...channel.state.pinnedMessages],
        read: { ...channel.state.read },
        watcherCount: channel.state.watcher_count,
        watchers: { ...channel.state.watchers },
      };
    }

    case 'initStateFromChannel': {
      const { channel } = action;
      return {
        ...state,
        loading: false,
        members: { ...channel.state.members },
        messages: [...channel.state.messages],
        pinnedMessages: [...channel.state.pinnedMessages],
        read: { ...channel.state.read },
        watcherCount: channel.state.watcher_count,
        watchers: { ...channel.state.watchers },
      };
    }

    case 'loadMoreFinished': {
      const { hasMore, messages } = action;
      return {
        ...state,
        hasMore,
        loadingMore: false,
        messages,
      };
    }

    case 'loadMoreThreadFinished': {
      const { threadHasMore, threadMessages } = action;
      return {
        ...state,
        threadHasMore,
        threadLoadingMore: false,
        threadMessages,
      };
    }

    case 'openThread': {
      const { channel, message } = action;
      return {
        ...state,
        thread: message,
        threadMessages: message.id ? { ...channel.state.threads }[message.id] || [] : [],
      };
    }

    case 'setError': {
      const { error } = action;
      return { ...state, error };
    }

    case 'setLoadingMore': {
      const { loadingMore } = action;
      return { ...state, loadingMore };
    }

    case 'setThread': {
      const { message } = action;
      return { ...state, thread: message };
    }

    case 'setTyping': {
      const { channel } = action;
      return {
        ...state,
        typing: { ...channel.state.typing },
      };
    }

    case 'startLoadingThread': {
      return {
        ...state,
        threadLoadingMore: true,
      };
    }

    case 'updateThreadOnEvent': {
      const { channel, message } = action;
      if (!state.thread) return state;
      return {
        ...state,
        thread:
          message?.id === state.thread.id ? channel.state.formatMessage(message) : state.thread,
        threadMessages: state.thread?.id ? { ...channel.state.threads }[state.thread.id] || [] : [],
      };
    }

    default:
      return state;
  }
};

export const initialState = {
  error: null,
  hasMore: true,
  loading: true,
  loadingMore: false,
  members: {},
  messages: [],
  pinnedMessages: [],
  read: {},
  thread: null,
  threadHasMore: true,
  threadLoadingMore: false,
  threadMessages: [],
  typing: {},
  watcherCount: 0,
  watchers: {},
};
