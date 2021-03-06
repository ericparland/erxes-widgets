import gql from 'graphql-tag';
import client from '../apollo-client';

export const connection = {
  setting: {},
  data: {},
  queryVariables: '$integrationId: String!, $customerId: String!',
  queryParams: 'integrationId: $integrationId, customerId: $customerId',
};

export const connect = variables =>
  // call connect mutation
  client.mutate({
    mutation: gql`
      mutation connect($brandCode: String!, $email: String,
        $name: String, $isUser: Boolean, $data: JSON,
        $browserInfo: JSON, $cachedCustomerId: String) {

        messengerConnect(brandCode: $brandCode, email: $email, name: $name,
          isUser: $isUser, data: $data, browserInfo: $browserInfo,
          cachedCustomerId: $cachedCustomerId) {

          integrationId,
          messengerData,
          uiOptions,
          customerId,
        }
      }`,

    variables,
  });


// get local storage
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('erxes') || '{}');


// get local storage item
export const getLocalStorageItem = (key) => {
  const erxesStorage = getLocalStorage();

  return erxesStorage[key];
};

// set local storage item
export const setLocalStorageItem = (key, value) => {
  const erxesStorage = getLocalStorage();

  erxesStorage[key] = value;

  localStorage.setItem('erxes', JSON.stringify(erxesStorage));
};
