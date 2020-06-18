import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { addFiles } from '../store/files/actions';
import { getDroppedOrSelectedFiles } from '../utils';

interface Props {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  open: () => void;
}

export default function DropzoneProvider(): Props {
  const dispatch = useDispatch();
  const { getRootProps, getInputProps, open } = useDropzone({
    getFilesFromEvent: async (event) => getDroppedOrSelectedFiles(event),
    onDropAccepted: (event) => dispatch(addFiles(event)),
    noClick: true,
  });

  return {
    getRootProps,
    getInputProps,
    open,
  };
}
