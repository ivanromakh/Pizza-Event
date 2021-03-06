import { browserHistory } from 'react-router';

import { showError } from './alerts';

export const handleResult = onSuccess => (error, result) => {
  if (error) {
    showError(error);
  } else {
    onSuccess(result);
    browserHistory.push('/');
  }
};

export const handleSignUp = (error) => {
  if (error) {
    showError(error);
  } else {
    browserHistory.push('/');
  }
};

export const getUserName = function getUserName(user) {
  return (user.profile) ? user.profile.name : user.username;
};
