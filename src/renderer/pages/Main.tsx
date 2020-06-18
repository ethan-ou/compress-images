import React, { ReactElement } from 'react';
import Toolbar from '../components/Toolbar';
import Dropzone from '../components/Dropzone';
import DropzoneProvider from '../components/DropzoneProvider';
import TableProvider from '../components/TableProvider';

export default function Main(): ReactElement {
  const { getRootProps, getInputProps, open } = DropzoneProvider();
  const { handleTableSelect, getTableState } = TableProvider();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex overflow-auto flex-grow w-full">
        <Dropzone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          open={open}
          handleTableSelect={handleTableSelect}
          getTableState={getTableState}
        />
      </div>
      <Toolbar
        openDropzone={open}
        handleTableSelect={handleTableSelect}
        getTableState={getTableState}
      />
    </div>
  );
}
