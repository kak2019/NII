import * as React from 'react';
import { ICaseListProps } from './ICaseListProps';
import App from "./App";
import AppContext from "../../../common/AppContext";
import { Provider } from "react-redux";
import store from "../../../common/store";
export default class CaseList extends React.Component<ICaseListProps, {}> {

  public render(): React.ReactElement<ICaseListProps> {
  const { context } = this.props;

    return (
      <AppContext.Provider value={{ context }}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContext.Provider>)
  }
}
