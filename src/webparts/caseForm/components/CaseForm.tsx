import * as React from "react";
import { ICaseFormProps } from "./ICaseFormProps";
import App from "./App";

export default class CaseForm extends React.Component<ICaseFormProps, {}> {
  public render(): React.ReactElement<ICaseFormProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;

    return (
      <div>
        <App />
      </div>
    );
  }
}
