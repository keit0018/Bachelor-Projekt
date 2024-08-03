import React from 'react';
import { Navigate } from 'react-router-dom';

const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { authenticated, userRole } = props;

    if (!authenticated) {
      return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRole;

