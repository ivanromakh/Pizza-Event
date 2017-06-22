import { browserHistory } from 'react-router';

export const handleResult = onSuccess => (error) => {
  if (!error) {
    browserHistory.push('/');
  }
};
