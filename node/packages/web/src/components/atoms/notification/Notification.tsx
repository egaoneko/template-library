import React, { FC } from 'react';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';

interface PropsType {}

const Notification: FC<PropsType> = () => {
  return <ReactNotification />;
};

export default Notification;
