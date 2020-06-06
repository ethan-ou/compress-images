import { ConvertActionTypes, START_CONVERT, CANCEL_CONVERT, FINISH_CONVERT } from "./types";

export function startConvert(): ConvertActionTypes {
    return { type: START_CONVERT }
}

export function cancelConvert(): ConvertActionTypes {
    return { type: CANCEL_CONVERT }
}

export function finishConvert(): ConvertActionTypes {
    return { type: FINISH_CONVERT }
}