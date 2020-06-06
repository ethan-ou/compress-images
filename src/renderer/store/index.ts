import { applyMiddleware, createStore, combineReducers, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer } from './files/reducer';
import { FilesState, FilesActionTypes } from './files/types';
import { ConvertState, ConvertActionTypes } from './convert/types';
import { convertReducer } from './convert/reducer';


const rootReducer = combineReducers({
    convert: convertReducer,
    files: filesReducer
});

export type RootAction = ConvertActionTypes | FilesActionTypes
export type RootState = ReturnType<typeof rootReducer>

const configureStore = (initialState?: RootState): Store<RootState | undefined> => {
    const middlewares: any[] = [];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

export default store;
