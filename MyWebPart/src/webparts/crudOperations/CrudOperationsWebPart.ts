import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CrudOperationsWebPartStrings';
import CrudOperations from './components/CrudOperations';
import { ICrudOperationsProps } from './components/ICrudOperationsProps';

export interface ICrudOperationsWebPartProps {
  description: string;
}

export default class CrudOperationsWebPart extends BaseClientSideWebPart<ICrudOperationsWebPartProps> {


  public render(): void {
    const element: React.ReactElement<ICrudOperationsProps> = React.createElement(
      CrudOperations,
      {
        description: this.properties.description,
        siteUrl:this.context.pageContext.web.absoluteUrl,
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
