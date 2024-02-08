import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDynamicDropdownProps {
  description: string;
  siteurl:string;
  singleValueOptions:any;//singleselected dropdown
  multiValueOptions:any;//multiSelected dropdown
  City:any;//lookup;
  context:WebPartContext;
}
