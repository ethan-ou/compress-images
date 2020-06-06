import React, { ReactElement } from "react";
import { connect } from "react-redux";
import ToolbarButton from "./ToolbarButton";
import { removeFiles, clearFiles } from "../store/files/actions";

interface ReactProps {
    openDropzone: () => void
}

type Props = ReactProps & DispatchProps

function Toolbar(props: Props): ReactElement {

  const handleAdd = () => {
    props.openDropzone();
  };

  const handleRemove = () => {
    props.removeFiles()
  };

  const handleClear = () => {
    props.clearFiles()
  };

  const handleSettings = setting => {
    // dispatch({ type: "OPEN_SETTINGS", state: setting });
  };

  const handleConvert = () => {
    // dispatch({ type: "CONVERT_FILES", mode: "PROCESSING" });
  };

  //Icons from: https://feathericons.com/
  return (
    <div className="px-3 py-2 bg-white shadow grid grid-cols-10 sm:grid-cols-12 gap-2 bg-gray-100 border-t border-gray-300 ">
      <ToolbarButton
        onClick={() => handleAdd()}
        text="Add File(s)"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
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
          style={{ display: "inline" }}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleRemove()}
        text="Remove"
        buttonStyles="bg-red-200 hover:bg-red-300 text-red-800 col-span-2"
      >
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
          style={{ display: "inline" }}
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => handleClear()}
        text="Clear All"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
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
          style={{ display: "inline" }}
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </ToolbarButton>
      <div className="hidden sm:block" />
      <ToolbarButton
        onClick={() => handleSettings(true)}
        text="Settings"
        buttonStyles="bg-gray-300 hover:bg-gray-400 text-gray-800 col-span-2"
      >
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
          style={{ display: "inline" }}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </ToolbarButton>
      <div className="hidden sm:block" />
      <ToolbarButton
        onClick={() => handleConvert()}
        text="Convert"
        buttonStyles="bg-green-200 hover:bg-green-300 text-green-900 col-span-2"
      >
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
          style={{ display: "inline" }}
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </ToolbarButton>
    </div>
  );
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>

const mapDispatchToProps = (dispatch) => ({
  removeFiles: (): void => dispatch(removeFiles()),
  clearFiles: (): void => dispatch(clearFiles())

})

export default connect(null, mapDispatchToProps)(Toolbar);