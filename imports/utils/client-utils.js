import { browserHistory } from 'react-router';

import { showError } from './alerts';

export const handleResult = onSuccess => (error) => {
  if (!error) {
    browserHistory.push('/');
  } else {
  	showError(error);
  }
};


export const handleSignUp = (error) => {
  if (error) {
    showError(error);
  } else {
  	browserHistory.push('/');
  }
};