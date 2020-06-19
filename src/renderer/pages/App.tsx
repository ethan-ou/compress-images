import React, { ReactElement } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Main from './Main';
import Settings from './Settings';

export default function App(): ReactElement {
  return (
    <HashRouter>
      <Route exact={true} path="/" component={Main} />
      <Route path="/settings" component={Settings} />
    </HashRouter>
  );
}
