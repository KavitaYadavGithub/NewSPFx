import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {sp} from '@pnp/sp/presets/all';
import * as strings from 'DynamicDropdownWebPartStrings';
import DynamicDropdown from './components/DynamicDropdown';
import { IDynamicDropdownProps } from './components/IDynamicDropdownProps';

export interface IDynamicDropdownWebPartProps {
  description: string;
  City:any;
}

export default class DynamicDropdownWebPart extends BaseClientSideWebPart<IDynamicDropdownWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      sp.setup({
        spfxContext:this.context as any
      });
      this.getLookupFields();
    });
  }

  public async render(): Promise<void> {
    const element: React.ReactElement<IDynamicDropdownProps> = React.createElement(
      DynamicDropdown,
      {
        description: this.properties.description,
        siteurl:this.context.pageContext.web.absoluteUrl,
        context:this.context,
        City:this.properties.City,
        singleValueOptions:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,'singleValueOptions'),
        multiValueOptions:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,'multiValueOptions')
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
  //Get ChoiceFields 

  public async getChoiceFields(siteurl:string,field:string):Promise<any>{
try{
  const response=await fetch(`${siteurl}/_api/web/lists/GetByTitle('DynamicList')/fields?$filter=EntityPropertyName eq '${field}'`,{
    method:'GET',
    headers:{
      'Accept':'application/json;odata=nometadata'
    }
  });
  if(!response.ok){
    console.error(`Error fetching choice fields.Status`,response.status);
    throw new Error(`Failed to fetch choice Fields`);
  }
  const data=await response.json();
  // console.log(`Choice Fields Data`,data);

  const choices=data?.value[0]?.Choices||[];
  return choices.map((choice:any)=>({
    key:choice,
    text:choice
  }));
}
catch(errors){
  console.error(`Error while fetching choice fields`);
  throw errors;
}

  }

  //Get Lookup field

  public async getLookupFields():Promise<void>{
    try{
      const response=await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Cities')/items?$select=Title,ID`,{
        method:'Get',
        headers:{
          'Accept':'application/json;odata=nometadata'
        }
      });
      
if(!response.ok){
  throw new Error(`Error while fetching city: ${response.status}-${response.statusText}`);
}
      const data=await response.json();
      const getOptions=data.value.map((city:{ID:string,Title:string})=>({
        key:city.ID,
        text:city.Title
      }));
      this.properties.City=getOptions;
    
    }
    catch(err){
      console.error(`Error in getLookupColumnValues`,err);
      throw err;
    }

  }
}
