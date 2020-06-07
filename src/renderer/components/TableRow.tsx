import React, { ReactEventHandler, ReactElement } from 'react';

interface Props {
  even?: number | undefined;
  odd?: number | undefined;
  img?: string;
  name: string;
  size: string | number;
  status?: string;
  selected: boolean;
  onClick: ReactEventHandler;
}

export default function File(props: Props): ReactElement {
  const evenOddStyle =
    (Number.isInteger(props.even) && props.even % 2 !== 0) ||
    (Number.isInteger(props.odd) && props.odd % 2 === 0)
      ? 'bg-gray-100'
      : 'bg-white';

  return (
    <tr
      className={props.selected === true ? 'bg-gray-400' : evenOddStyle}
      onMouseDown={props.onClick}
    >
      <td className="px-3 py-3 text-xs">
        <div className="flex items-center ">
          <div className="flex-shrink-0 w-5 h-5">
            <img className="w-full h-full rounded-sm object-cover" src={props.img} alt="" />
          </div>
          <div className="ml-2">
            <p className="text-gray-900 font-bold">{props.name}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-xs">{props.size}</td>
      <td className="px-5 py-3 text-xs">{props.status}</td>
    </tr>
  );
}
