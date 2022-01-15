import {AxiosError} from 'axios';
import {AppPaths, HttpErrorStatuses} from '../constants';
import {authorizationDenied, serverAvailabilityChecked} from './extra-actions';
import {AppDispatch} from './store';
import history from './../browser-history';

export const handleSuccess = (dispatch: AppDispatch): void => {
  dispatch(serverAvailabilityChecked(true));
};

export const handleError = (err : AxiosError, dispatch: AppDispatch): void => {

  const {response} = err;

  if (response && response.status === HttpErrorStatuses.unauthorized) {
    dispatch(authorizationDenied());
  }
  if (response && response.status === HttpErrorStatuses.notFound) {
    history.push(AppPaths.NOT_FOUND);
    throw err;
  }
  if (response && response.status >= 500) {
    dispatch(serverAvailabilityChecked(false));
    setTimeout(() => dispatch(serverAvailabilityChecked(true)), 5000);
  }
};
