import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHandlingLargeListProps {
  description: string;
  context:WebPartContext;
  ListName:string;
}
