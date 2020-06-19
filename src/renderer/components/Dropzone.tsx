import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import prettyBytes from 'pretty-bytes';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import Table from './Table';
import TableRow from './TableRow';
import { RootState } from '../store';
import { TableStateProps, TableSelectProps } from './TableProvider';
import { AppFile } from '../../types';

interface ReactProps {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  open: () => void;
  getTableState: TableStateProps;
  handleTableSelect: TableSelectProps;
}

type Props = ReactProps & StateProps;

function Dropzone(props: Props): ReactElement {
  const handleSelected = (state: number[], index: number): boolean => {
    return !!state.includes(index);
  };

  const zone = (
    <div
      {...props.getRootProps({
        className:
          'w-screen flex items-center content-center border-dashed border-4 border-gray-600 bg-gray-100 hover:bg-white',
        onClick: () => props.open(),
      })}
    >
      <input {...props.getInputProps()} />
      <p className="m-auto text-xl font-medium text-gray-600 text-center">
        Drag &apos;n&apos; drop files here, or click Add File(s).
      </p>
    </div>
  );

  const files = (
    <div
      {...props.getRootProps({
        className: 'w-full',
      })}
    >
      <input {...props.getInputProps()} />
      <Table head={['Name', 'Size', 'Status']}>
        {props.files.map((file: AppFile, idx: number) => (
          <TableRow
            key={file.id}
            name={file.name}
            size={prettyBytes(file.size)}
            img={file.path}
            even={idx}
            selected={handleSelected(props.getTableState().selected.items, idx)}
            status={file.status}
            onClick={(e) => props.handleTableSelect(e, idx)}
          />
        ))}
      </Table>
      {/* eslint-disable-next-line */}
      <div className="h-full" onMouseDown={(e) => props.handleTableSelect(e, null)} />
    </div>
  );

  return <>{props.files.length > 0 ? files : zone}</>;
}

const mapStateToProps = (state: RootState) => {
  return {
    files: state.files.files,
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Dropzone);
