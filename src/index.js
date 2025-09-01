import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import { ThemeProvider } from 'react-bootstrap';
import App from './App';
import { GlobalContextProvider } from './contexts/globalContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<GlobalContextProvider>
      <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
      <App />
      </ThemeProvider>
      </GlobalContextProvider>
);


