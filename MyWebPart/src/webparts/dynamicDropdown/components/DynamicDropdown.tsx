import * as React from 'react';
// import styles from './DynamicDropdown.module.scss';
import type { IDynamicDropdownProps } from './IDynamicDropdownProps';
import {Web} from '@pnp/sp/presets/all';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import { Dropdown,IDropdownOption,PrimaryButton } from '@fluentui/react';
// import { escape } from '@microsoft/sp-lodash-subset';
export interface IDynamicDropdownState{
  singleValueOptions:string;
  multiValueOptions:any;
  City:any;
}
export default class DynamicDropdown extends React.Component<IDynamicDropdownProps, IDynamicDropdownState> {
  constructor(props:any){
    super(props);
    this.state={
      singleValueOptions:'',
      multiValueOptions:[],
      City:''
    }
  }

  //SingleValue Dropdown
  public onDropdownChange=(event:React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    this.setState({singleValueOptions:item?.key as string});
  }

  //multivaluedropdown

  public onDropdwonMultiChange=(event:React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    const selectedKeys=item.selected?[...this.state.multiValueOptions,item.key as string]:
    this.state.multiValueOptions.filter((key:any)=>key!==item);
    this.setState({multiValueOptions:selectedKeys});
  }

  //Lookup Dropdown
  public onCityChange=(event:React.FormEvent<HTMLDivElement>,item:IDropdownOption):void=>{
    this.setState({City:item?.key as number||null});
  }
  public async saveData(){
    const web=Web(this.props.siteurl);
    await web.lists.getByTitle('DynamicList').items.add({
      singleValueOptions:this.state.singleValueOptions,
      multiValueOptions:{results:this.state.multiValueOptions},
      CityId:this.state.City
    })
    .then((data)=>{
      console.log('No Error found');
      return data;
    })
    .catch((err)=>{
      console.error('erorr found');
      throw err;
    })
  }
  public render(): React.ReactElement<IDynamicDropdownProps> {
 

    return (
   <>
   <Dropdown
   
   options={this.props.singleValueOptions}
   placeholder='select course'

   label='Course Selections'
   selectedKey={this.state.singleValueOptions}
   onChange={this.onDropdownChange}
   />
  
   <Dropdown
   
   options={this.props.multiValueOptions}
   placeholder='select Skills'

   label='Skills Selections'
  //  selectedKey={this.state.multiValueOptions}
  defaultSelectedKeys={this.state.multiValueOptions}
  multiSelect
   onChange={this.onDropdwonMultiChange}
   />
  <Dropdown
   
   options={this.props.City}
   placeholder='select city'

   label='City Selection'
   selectedKey={this.state.City}
   onChange={this.onCityChange}
   />

   <br/>
   <PrimaryButton text='Save' onClick={()=>this.saveData()}/>
   </>
    );
  }
}
