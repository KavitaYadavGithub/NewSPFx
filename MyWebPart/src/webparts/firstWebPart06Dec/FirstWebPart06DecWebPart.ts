import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FirstWebPart06DecWebPartStrings';
import FirstWebPart06Dec from './components/FirstWebPart06Dec';
import { IFirstWebPart06DecProps } from './components/IFirstWebPart06DecProps';

export interface IFirstWebPart06DecWebPartProps {
  description: string;
}

export default class FirstWebPart06DecWebPart extends BaseClientSideWebPart<IFirstWebPart06DecWebPartProps> {



  public render(): void {
    const element: React.ReactElement<IFirstWebPart06DecProps> = React.createElement(
      FirstWebPart06Dec,
      {
        description: this.properties.description,
     siteurl:this.context.pageContext.web.absoluteUrl,
     context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
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
