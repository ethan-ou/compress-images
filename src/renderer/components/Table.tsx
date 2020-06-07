import React, { ReactElement } from 'react';
import shortid from 'shortid';

interface Props {
  head: string[];
  children: ReactElement[];
}

export default function Table(props: Props): ReactElement {
  return (
    <table className="w-full leading-normal">
      <thead>
        <tr>
          {props.head.map((item) => (
            <th
              key={shortid()}
              className="px-5 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="select-none overflow-y-scroll">{props.children}</tbody>
    </table>
  );
}
