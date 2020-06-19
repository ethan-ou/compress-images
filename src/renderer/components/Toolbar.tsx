import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ToolbarButton from './ToolbarButton';
import { removeFiles, clearFiles } from '../store/files/actions';
import { startProcess, cancelProcess } from '../store/process/actions';
import { RootState, ThunkDispatchT } from '../store';
import { TableSelectProps, TableStateProps } from './TableProvider';

import PlusIcon from '../assets/icons/plus.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import XIcon from '../assets/icons/x.svg';
import TrashIcon from '../assets/icons/trash-2.svg';
import PlayIcon from '../assets/icons/play.svg';
import CancelIcon from '../assets/icons/x-circle.svg';

interface ReactProps {
  openDropzone: () => void;
  handleTableSelect: TableSelectProps;
  getTableState: TableStateProps;
}

type Props = ReactProps & StateProps & DispatchProps;

function Toolbar(props: Props): ReactElement {
  const { push } = useHistory();

  //Icons from: https://feathericons.com/
  return (
    <div className="px-3 py-2 bg-white shadow grid grid-cols-10 sm:grid-cols-12 gap-2 bg-gray-100 border-t border-gray-300 ">
      <ToolbarButton
        onClick={() => props.openDropzone()}
        text="Add File(s)"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
        <PlusIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const state = props.getTableState();
          props.removeFiles(state.selected.items);
        }}
        text="Remove"
        buttonStyles="bg-red-200 hover:bg-red-300 text-red-800 col-span-2"
      >
        <XIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => {
          props.clearFiles();
          props.handleTableSelect(e, null);
        }}
        text="Clear All"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
        <TrashIcon />
      </ToolbarButton>
      <div className="hidden sm:block" />
      <ToolbarButton
        text="Settings"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
        onClick={() => push('/settings')}
      >
        <SettingsIcon />
      </ToolbarButton>
      <div className="hidden sm:block" />
      {props.mode === 'WAITING' ? (
        <ToolbarButton
          onClick={() => {
            if (props.files.length > 0) {
              props.startProcess();
            }
          }}
          text="Process"
          buttonStyles="bg-green-200 hover:bg-green-300 text-green-900 col-span-2"
        >
          <PlayIcon />
        </ToolbarButton>
      ) : (
        <ToolbarButton
          onClick={() => props.cancelProcess()}
          text="Cancel"
          buttonStyles="bg-red-200 hover:bg-red-300 text-red-800 col-span-2"
        >
          <CancelIcon />
        </ToolbarButton>
      )}
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.process.mode,
    files: state.files.files,
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
