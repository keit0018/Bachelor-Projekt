import React from 'react';
import { CallComposite } from '@azure/communication-react';

const CallingComponents = ({ adapter }) => {
  return <CallComposite adapter={adapter} />;
};

export default CallingComponents;