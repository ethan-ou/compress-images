import { START_CONVERT, CANCEL_CONVERT, ConvertState, FINISH_CONVERT, ConvertActionTypes } from "./types";


const initialState: ConvertState = {
    mode: "INITIAL"
}

export function convertReducer(state = initialState, action: ConvertActionTypes): ConvertState {
    switch(action.type) {
        case START_CONVERT: {
            return {
                ...state,
                mode: "PROCESSING"
            }
        }

        case CANCEL_CONVERT: {
            return {
                ...state,
                mode: "CANCELLED"
            }
        }

        case FINISH_CONVERT: {
            return {
                ...state,
                mode: "FINISHED"
            }
        }

        default: {
            return state
        }
    }
}