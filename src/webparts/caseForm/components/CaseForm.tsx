import * as React from "react";
import { ICaseFormProps } from "./ICaseFormProps";
import AppContext from "../../../common/AppContext";
import { Provider } from "react-redux";
import store from "../../../common/store";
import App from "./App";

export default class CaseForm extends React.Component<ICaseFormProps, {}> {
  public render(): React.ReactElement<ICaseFormProps> {
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
