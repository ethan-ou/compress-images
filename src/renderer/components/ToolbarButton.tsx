import React, { ReactEventHandler, ReactElement } from 'react';

interface Props {
  onClick: ReactEventHandler;
  buttonStyles: string;
  children: ReactElement;
  text: string;
}

export default function ToolbarButton(props: Props) {
  return (
    <button
      className={`text-xs font-semibold py-2 px-1 rounded flex flex-col items-stretch ${props.buttonStyles}`}
      onClick={props.onClick}
    >
      <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        {props.children}
        <span className="sm:ml-1">{props.text}</span>
      </div>
    </button>
  );
}
