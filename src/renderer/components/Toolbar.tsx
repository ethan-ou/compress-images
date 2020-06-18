import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ToolbarButton from './ToolbarButton';
import { removeFiles, clearFiles } from '../store/files/actions';
import { startProcess, cancelProcess } from '../store/process/actions';
import { RootState, ThunkDispatchT } from '../store';
import { TableState, TableSelectProps, TableStateProps } from './TableProvider';

interface ReactProps {
  openDropzone: () => void;
  handleTableSelect: TableSelectProps;
  getTableState: TableStateProps;
}

type Props = ReactProps & StateProps & DispatchProps;

function Toolbar(props: Props): ReactElement {
  const handleSettings = (setting) => {
    // dispatch({ type: "OPEN_SETTINGS", state: setting });
  };

  const icons = {
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-plus"
        style={{ display: 'inline' }}
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    x: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x"
        style={{ display: 'inline' }}
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    trash: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-trash-2"
        style={{ display: 'inline' }}
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
    settings: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-settings"
        style={{ display: 'inline' }}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    play: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-play"
        style={{ display: 'inline' }}
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    cancel: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x-octagon"
      >
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };
  const button = {
    add: (
      <ToolbarButton
        onClick={() => props.openDropzone()}
        text="Add File(s)"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
        {icons.plus}
      </ToolbarButton>
    ),
    remove: (
      <ToolbarButton
        onClick={() => {
          const state = props.getTableState();
          props.removeFiles(state.selected.items);
        }}
        text="Remove"
        buttonStyles="bg-red-200 hover:bg-red-300 text-red-800 col-span-2"
      >
        {icons.x}
      </ToolbarButton>
    ),
    clear: (
      <ToolbarButton
        onClick={(e) => {
          props.clearFiles();
          props.handleTableSelect(e, null);
        }}
        text="Clear All"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
        {icons.trash}
      </ToolbarButton>
    ),
    settings: (
      <ToolbarButton
        onClick={() => handleSettings(true)}
        text="Settings"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
        {icons.settings}
      </ToolbarButton>
    ),
    process: (
      <ToolbarButton
        onClick={() => props.startProcess()}
        text="Process"
        buttonStyles="bg-green-200 hover:bg-green-300 text-green-900 col-span-2"
      >
        {icons.play}
      </ToolbarButton>
    ),
    cancel: (
      <ToolbarButton
        onClick={() => props.cancelProcess()}
        text="Cancel"
        buttonStyles="bg-red-200 hover:bg-red-300 text-red-800 col-span-2"
      >
        {icons.cancel}
      </ToolbarButton>
    ),
  };

  //Icons from: https://feathericons.com/
  return (
    <div className="px-3 py-2 bg-white shadow grid grid-cols-10 sm:grid-cols-12 gap-2 bg-gray-100 border-t border-gray-300 ">
      {button.add}
      {button.remove}
      {button.clear}
      <div className="hidden sm:block" />
      {button.settings}
      <div className="hidden sm:block" />
      {props.mode === 'WAITING' ? button.process : button.cancel}
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.process.mode,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatchT) => ({
  removeFiles: (location: number[]) => dispatch(removeFiles(location)),
  clearFiles: () => dispatch(clearFiles()),
  startProcess: () => dispatch(startProcess()),
  cancelProcess: () => dispatch(cancelProcess()),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
