import * as React from 'react';
import { service } from '../../../Services/service';
import type { IHandlingLargeListProps } from './IHandlingLargeListProps';
import { IListItems } from './IListItems';
import { IHandlingLargeLisStates } from './IHandlingLargeListState';
import { DetailsList } from '@fluentui/react';
export default class HandlingLargeList extends React.Component<IHandlingLargeListProps, IHandlingLargeLisStates> {
  private _service:service;
  constructor(props:any){
    super(props);
    this.state={
      ListResults:[]
    }
    this._service=new service(this.props.context);
  }
  public componentDidMount(){
    // this._service.getMoreThan5000ItemswithoutUsingCAMLQuery(this.props.ListName)
    // .then((result:IListItems[])=>this.setState({ListResults:result}));
    this._service.getMorethan5000itemsUsingCAMLQuery(this.props.ListName)
    .then((result:IListItems[])=>this.setState({ListResults:result}));
    
  }
  public render(): React.ReactElement<IHandlingLargeListProps> {
  
    return (
     <>
     <DetailsList items={this.state.ListResults}/>
     </>
    );
  }
}
