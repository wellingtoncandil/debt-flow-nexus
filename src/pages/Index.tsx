
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect from the index page to the login page
const Index = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
