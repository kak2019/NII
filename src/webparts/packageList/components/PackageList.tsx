import * as React from "react";
import { IPackageListProps } from "./IPackageListProps";
import App from "./App";
import AppContext from "../../../common/AppContext";
import { Provider } from "react-redux";
import store from "../../../common/store";

export default class PackageList extends React.Component<
  IPackageListProps,
  {}
> {
  public render(): React.ReactElement<IPackageListProps> {
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
