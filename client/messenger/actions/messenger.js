/* global window */

import gql from 'graphql-tag';

import {
  MESSENGER_TOGGLE,
  CHANGE_ROUTE,
  CHANGE_CONVERSATION,
  SAVED_EMAIL,
  END_CONVERSATION,
} from '../constants';

import { connection, setLocalStorageItem, getLocalStorageItem } from '../connection';
import client from '../../apollo-client';

export const toggle = (isVisible) => {
  // notify parent window launcher state
  window.parent.postMessage({
    fromErxes: true,
    fromMessenger: true,
    purpose: 'messenger',
    isVisible: !isVisible,
  }, '*');

  return {
    type: MESSENGER_TOGGLE,
  };
};

export const toggleNotifer = (isVisible) => {
  // notify state
  window.parent.postMessage({
    fromErxes: true,
    fromMessenger: true,
    purpose: 'notifier',
    isVisible: !isVisible,
  }, '*');
};

export const toggleNotiferFull = (isVisible) => {
  // notify state
  window.parent.postMessage({
    fromErxes: true,
    fromMessenger: true,
    purpose: 'notifierFull',
    isVisible: !isVisible,
  }, '*');
};


export const changeRoute = route => ({
  type: CHANGE_ROUTE,
  route,
});

export const changeConversation = (conversationId) => {
  // save last conversationId
  setLocalStorageItem('lastConversationId', conversationId);

  return {
    type: CHANGE_CONVERSATION,
    conversationId,
  };
};

export const openLastConversation = () => {
  const conversationId = getLocalStorageItem('lastConversationId');

  return {
    type: CHANGE_CONVERSATION,
    conversationId,
  };
};

export const saveEmail = email => dispatch =>
  client.mutate({
    mutation: gql`
      mutation saveCustomerEmail($customerId: String!, $email: String!) {
        saveCustomerEmail(customerId: $customerId, email: $email)
      }`,

    variables: {
      customerId: connection.data.customerId,
      email,
    },
  })

  // after mutation
  .then(() => {
    // save email
    setLocalStorageItem('visitorEmail', email);

    dispatch({ type: SAVED_EMAIL });
  });


export const endConversation = () => (dispatch) => {
  const setting = connection.setting;

  // ignore this action for inapp
  if (setting.email) {
    return;
  }

  client.mutate({
    mutation: gql`
      mutation endConversation($brandCode: String!, $data: JSON) {
        endConversation(brandCode: $brandCode, data: $data) {
          customerId
        }
      }`,

    variables: {
      brandCode: setting.brand_id,
      data: setting.data,
    },
  })

  // after mutation
  .then(({ data }) => {
    const { customerId } = data.endConversation;

    // reset local storage items
    setLocalStorageItem('visitorEmail', '');
    setLocalStorageItem('lastConversationId', '');
    setLocalStorageItem('customerId', customerId);

    // update connection customerId
    connection.data.customerId = customerId;

    dispatch({ type: END_CONVERSATION });
    dispatch({ type: CHANGE_ROUTE, route: 'conversations' });
  });
};
