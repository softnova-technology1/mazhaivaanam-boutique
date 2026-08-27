import React from 'react';
import { MyProfile } from '../MyProfile/MyProfile';

export const SavedAddress = ({ setCurrentTab }) => {
  return <MyProfile setCurrentTab={setCurrentTab} initialSection="addresses" />;
};
