import { useDropzone, DropEvent } from "react-dropzone";
import { fromEvent } from "file-selector";
import { useDispatch } from 'react-redux';
import { addFiles } from "../store/files/actions";
import {getDroppedOrSelectedFiles} from "../utils"

export default function DropzoneProvider() {
  const dispatch = useDispatch()
  const { getRootProps, getInputProps, open } = useDropzone({
    getFilesFromEvent: async (event) => getDroppedOrSelectedFiles(event),
    onDropAccepted: (event) => dispatch(addFiles(event, "Waiting")),
    noClick: true
  });

  return {
    getRootProps,
    getInputProps,
    open
  };
}