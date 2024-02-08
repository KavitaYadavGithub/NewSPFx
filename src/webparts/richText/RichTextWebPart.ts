import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {sp} from "@pnp/sp/presets/all";

import * as strings from 'RichTextWebPartStrings';
// import RichText from './components/RichText';
import { IRichTextProps } from './components/IRichTextProps';
import RichTexts from './components/RichText';

export interface IRichTextWebPartProps {
  description: string;
}

export default class RichTextWebPart extends BaseClientSideWebPart<IRichTextWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(()=> {
     sp.setup({
      spfxContext:this.context as any
     });
    });
  }

  public render(): void {
    const element: React.ReactElement<IRichTextProps> = React.createElement(
      RichTexts,
      {
        description: this.properties.description,
       context:this.context,
       siteurl:this.context.pageContext.web.absoluteUrl
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
