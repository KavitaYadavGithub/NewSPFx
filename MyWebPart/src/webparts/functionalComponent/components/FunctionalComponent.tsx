import * as React from 'react';
import { IFunctionalComponentProps } from './IFunctionalComponentProps'; 
import { createData } from '../../../Service/service';
import { useState } from 'react';
import { Label,TextField,PrimaryButton,Dropdown,IDropdownOption,ChoiceGroup,IChoiceGroupOption,Toggle,Slider,Checkbox } from '@fluentui/react';
import { IFunctionalComponentState } from './IFunctionalComponentState';
// import {siteurl} from './config'
const  FunctionalComponent:React.FC<IFunctionalComponentProps>=(props)=>{

  const department:IDropdownOption[]=[
    {key:'IT',text:'IT'},
    {key:'Audit',text:'Audit'},
    {key:'Finance',text:'Finance'}
  ]

  const gender:IChoiceGroupOption[]=[
    {key:'Male',text:'Male'},
    {key:'Female',text:'Female'}
  ]
  const[Title,setTitle]=useState<string>('');
  const[Department,setDepartment]=useState<string>('');
  const[Toggle_V,setToggle_V]=useState<boolean>(false);
  const[Score,setScore]=useState<any>(0);
  const[Permission,setPermission]=useState<boolean>(false);
  const[Gender,setGender]=useState<any>('');

  const createDataHandler=async()=>{
    await createData(props.siteurl,{
      Title,
      Department,
      Toggle_V,
      Score,
      Permission,
      Gender
    });
    //Clear the form after submitting
    setTitle("");
    setDepartment("");
    setToggle_V(false);
    setScore(0);
    setPermission(false);
    setGender("");

  
}

//Form Event
const handleChange=(fieldName:keyof IFunctionalComponentState,value:number|string|boolean):void=>{
  switch(fieldName){
    case 'Title':
      setTitle(value as string); 
      break;

    case 'Department':
      setDepartment(value as string);
      break;

    case 'Toggle_V':
      setToggle_V(value as boolean);
      break;

    case 'Score':
      setScore(value as any);
      break;

    case 'Permission':
      setPermission(value as boolean);
      break;

    case 'Gender':
      setGender(value as any);
      break;
    default:
      break;
  }
};
return(
  <>
  <Label>Employee Name:</Label>
  <TextField name="Title" value={Title}
  onChange={(_,val)=>handleChange('Title',val||'')}/>
  <Label>Department:</Label>
  <Dropdown options={department}
  placeholder='choose an options'
  selectedKey={Department}
  onChange={(_,value)=>handleChange("Department",value?.key as string)}
  />
  <Label>Toggle Value:</Label>
  <Toggle 
  checked={Toggle_V}
  onChange={(_,checked)=>handleChange("Toggle_V",!!checked)}
  />
  <Label>Score:</Label>
  <Slider
  
  min={1}
  max={100}
  value={Score}
  onChange={(value)=>handleChange('Score',value)}/>
  <Label>Permission</Label>
  <Checkbox 
  checked={Permission}
  onChange={(_,checked)=>handleChange("Permission",!!checked)}
  />
  <Label>Gender:</Label>
  <ChoiceGroup 
  options={gender}
  onChange={(_,options)=>handleChange("Gender",options?.key as any)}
  />
  <br/>
  <PrimaryButton text='Save' onClick={createDataHandler} iconProps={{iconName:'save'}}/>
  </>
)
}
export default  FunctionalComponent ;