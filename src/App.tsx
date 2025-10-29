import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { routes } from './router';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {routes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

const App: React.FC = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
