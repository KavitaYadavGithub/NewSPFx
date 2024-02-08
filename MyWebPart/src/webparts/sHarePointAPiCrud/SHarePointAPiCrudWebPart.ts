import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {sp} from '@pnp/sp/presets/all';

import * as strings from 'SHarePointAPiCrudWebPartStrings';
import SHarePointAPiCrud from './components/SHarePointAPiCrud';
import { ISHarePointAPiCrudProps } from './components/ISHarePointAPiCrudProps';

export interface ISHarePointAPiCrudWebPartProps {
  description: string;
}

export default class SHarePointAPiCrudWebPart extends BaseClientSideWebPart<ISHarePointAPiCrudWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      sp.setup({
        spfxContext:this.context as any
      })
    });
  }

  public render(): void {
    const element: React.ReactElement<ISHarePointAPiCrudProps> = React.createElement(
      SHarePointAPiCrud,
      {
        description: this.properties.description,
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
