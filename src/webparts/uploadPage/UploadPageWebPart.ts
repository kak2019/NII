import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UploadPageWebPartStrings';
import UploadPage from './components/UploadPage';
import { IUploadPageProps } from './components/IUploadPageProps';
import { getSP } from '../../common/pnpjsConfig';
import { AadHttpClient } from '@microsoft/sp-http';
export interface IUploadPageWebPartProps {
  description: string;
}

export let mytoken = ""

export default class UploadPageWebPart extends BaseClientSideWebPart<IUploadPageWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  protected token: string = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected aadClient: any = null;
  public render(): void {
    const element: React.ReactElement<IUploadPageProps> = React.createElement(
      UploadPage,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context:this.context,
        token: this.token,
        aadClient: this.aadClient,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    getSP(this.context);
    this.context.aadTokenProviderFactory.getTokenProvider().then((provider): void => {
      provider.getToken('b407b2b3-b500-4ea9-92f1-ca4c28558347').then((token): void => {
        this.token = token;
        mytoken = token
        console.log("tokenAAD:" + token);
      }, err => console.log("errorTokenAAD:" + err));
    }, err => console.log("errorGetProvider:" + err));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      const clientPromises = [];

      clientPromises.push(
        this.context.aadHttpClientFactory
          .getClient('b407b2b3-b500-4ea9-92f1-ca4c28558347')
          .then((client: AadHttpClient): void => {
            this.aadClient = client;
            //console.log("aadClient:" + this.aadClient);
            return this.aadClient;
          }, err => console.log("errorGetaadClient:" + err))
      );
          
      Promise.all(clientPromises).then(
        response => {
          // console.log(response[0]);
          // console.log(response[1]);
          resolve();
        }
      ).catch(err => console.log(err))

    });
    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
