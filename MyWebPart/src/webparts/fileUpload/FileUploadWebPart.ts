import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FileUploadWebPartStrings';
import FileUpload from './components/FileUpload';
import { IFileUploadProps } from './components/IFileUploadProps';
import {sp} from '@pnp/sp';
export interface IFileUploadWebPartProps {
  description: string;
}

export default class FileUploadWebPart extends BaseClientSideWebPart<IFileUploadWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
     sp.setup({
      spfxContext:this.context as any
     });
    });
  }
  public render(): void {
    const element: React.ReactElement<IFileUploadProps> = React.createElement(
      FileUpload,
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
