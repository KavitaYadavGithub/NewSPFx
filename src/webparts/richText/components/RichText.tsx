import * as React from 'react';
import styles from './RichText.module.scss';
import type { IRichTextProps } from './IRichTextProps';
// import * as  ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { TextField } from '@fluentui/react/lib/TextField';
import{RichText} from "@pnp/spfx-controls-react/lib/RichText";
import {Web} from '@pnp/sp/presets/all';

export interface IRichTextState{
  RichTextString:any;
}

export default class RichTexts extends React.Component<IRichTextProps,IRichTextState> {
constructor(props:any){
  super(props);
  this.state={
    RichTextString:""
  }
} 

public async SaveData(){
  let web=Web(this.props.siteurl);
await web.lists.getByTitle("").items.add({
    RichTextString:this.state.RichTextString

  })
  
  .then((data:any)=>{
    console.log("No error found");
    
    return data;
  })
  .catch((err)=>{
    console.error("Error found");
    throw err;
  })
}

private onTextCahnge=(newText:string)=>{
  newText=newText.replace("bold","<strong>bold</strong>");
  this.props.description=newText
  return newText
}
private handleChange=(fields:keyof IRichTextState,value:string|boolean|number):void=>{
  this.setState({[fields]:value}as unknown as Pick<IRichTextState,keyof IRichTextState>)
}
  public render(): React.ReactElement<IRichTextProps> {
  
    return (
   <>
  <RichText  
  value={this.state.RichTextString}
  // onChange={(text)=>this.handleChange("RichTextString",text||"")}
  // onChange={(_,text:any)=>this.handleChange("RichTextString",text||'')}
  onChange={(text)=>this.onTextCahnge(text)}
  />
   </>
    );
  }
}
