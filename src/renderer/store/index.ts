import { applyMiddleware, createStore, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer } from './files/reducer';
import { FilesActionTypes } from './files/types';
import { ProcessActionTypes } from './process/types';
import { processReducer } from './process/reducer';

const rootReducer = combineReducers({
  process: processReducer,
  files: filesReducer,
});

export type RootAction = ProcessActionTypes | FilesActionTypes;
export type RootState = ReturnType<typeof rootReducer>;

const configureStore = (initialState?: RootState): Store<RootState | undefined> => {
  const middlewares: any[] = [];
  middlewares.push(thunk);
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

export default store;
