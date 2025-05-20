import { notification } from 'antd';


export const showSuccessNotification = (message, description = '') => {
  notification.success({
    message,
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

export const showErrorNotification = (message, description = '') => {
  notification.error({
    message,
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

export const showInfoNotification = (message, description = '') => {
  notification.info({
    message,
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

export const showWarningNotification = (message, description = '') => {
  notification.warning({
    message,
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};