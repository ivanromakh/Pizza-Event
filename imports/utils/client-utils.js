import { browserHistory } from 'react-router';

export const handleResult = onSuccess => (error, result) => {
  if (!error) {
  	console.log(result);
  	browserHistory.push("/");
  }
};