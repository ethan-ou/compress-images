import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export default function Settings(): ReactElement {
  return (
    <div className="h-screen flex flex-col">
      <Link to="/">
        <h1>Hello</h1>
      </Link>
    </div>
  );
}
