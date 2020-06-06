import React from 'react';
import Toolbar from '../components/Toolbar';
import Dropzone from '../components/Dropzone';
import DropzoneProvider from '../components/DropzoneProvider';

export default function Main() {
  const { getRootProps, getInputProps, open } = DropzoneProvider();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex overflow-auto flex-grow w-full">
        <Dropzone getRootProps={getRootProps} getInputProps={getInputProps} open={open} />
      </div>
      <Toolbar openDropzone={open} />
    </div>
  );
}
