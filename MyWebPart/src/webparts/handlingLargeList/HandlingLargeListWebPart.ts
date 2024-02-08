import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HandlingLargeListWebPartStrings';
import HandlingLargeList from './components/HandlingLargeList';
import { IHandlingLargeListProps } from './components/IHandlingLargeListProps';
import {sp} from "@pnp/sp";
export interface IHandlingLargeListWebPartProps {
  description: string;
}

export default class HandlingLargeListWebPart extends BaseClientSideWebPart<IHandlingLargeListWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
    sp.setup({
      spfxContext:this.context
    });
    });
  }


  public render(): void {
    const element: React.ReactElement<IHandlingLargeListProps> = React.createElement(
      HandlingLargeList,
      {
        description: this.properties.description,
       context:this.context,
       ListName:'EmployeeData'
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
