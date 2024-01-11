import * as React from 'react';
// import styles from './HomePage.module.scss';
import { IHomePageProps } from './IHomePageProps';
import App from "./App";
import AppContext from "../../../common/AppContext";
import { Provider } from "react-redux";
import store from "../../../common/store";
export default class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    const { context } = this.props;

    return (
      <AppContext.Provider value={{ context }}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContext.Provider>
    );
  }
}
