import * as React from 'react';
//import styles from './FirstWebPart06Dec.module.scss';
import type { IFirstWebPart06DecProps } from './IFirstWebPart06DecProps';
import { IFirstWebPart06DecState } from './IFirstWebPart06DecState';
import {Web} from '@pnp/sp/presets/all';
import { Label, PrimaryButton, TextField,Slider} from '@fluentui/react';
import { DatePicker,IDatePickerStrings } from '@fluentui/react/lib/DatePicker';
export default class FirstWebPart06Dec extends React.Component<IFirstWebPart06DecProps,IFirstWebPart06DecState> {
  constructor(props:any){
    super(props);
    this.state={
      Title:'',
      Age:'',
      JoiningDate:null,
      PhoneNo:null,
      EmailAdd:null,
      ValidateForm:{},
      score:0,
    }
  }

  //Form Validation

  private validateFormFields():boolean{
    const{Title,PhoneNo,EmailAdd}=this.state;

    const errors:any={};

    if(!Title){
      errors.Title="Employee Name Can't Be Empty";
    }
    if(!PhoneNo || !/^\d{10}$/.test(PhoneNo)){
      errors.PhoneNo="Please Enter Valid 10 Digits Contact Number";
    }
if(!EmailAdd || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(EmailAdd)){
  errors.EmailAdd="Please Enter Valid Email Address";
}

this.setState({ValidateForm:errors});
return Object.keys(errors).length===0;

  }

  // create data method

  public async CreateData(){

    if(!this.validateFormFields()){
      return;
    }
  const web=Web(this.props.siteurl);

    await web.lists.getByTitle('FirstWebPart06DecList').items.add({
      Title:this.state.Title,
      Age:this.state.Age,
      score:this.state.score,
      JoiningDate:this.state.JoiningDate,
      PhoneNo:this.state.PhoneNo,
      EmailAdd:this.state.EmailAdd
    })
     .then((data)=>{
      console.log('No Error Found');
      return data;
     })
     .catch((err)=>{
        console.error('Error Found');
        throw err;
     })

     alert('Data has been submitted successfully');

       this.setState({
        Title:'',
        Age:'',
        score:0,
        JoiningDate:null,
        PhoneNo:null,
        EmailAdd:null
       })

     }

   // Event Handler

  private handleChange=(fieldName:keyof IFirstWebPart06DecState,value:string|number|boolean):void=>{
    this.setState({[fieldName]:value} as unknown as Pick<IFirstWebPart06DecState, keyof IFirstWebPart06DecState>);

  }
  public render(): React.ReactElement<IFirstWebPart06DecProps> {
const {ValidateForm}=this.state;

    return (
      <>
<Label>Employee Name</Label>
<TextField type='text' value={this.state.Title}
onChange={(_,empName)=>this.handleChange('Title',empName||'')}
errorMessage={ValidateForm.Title}
/>
<Label>Age:</Label>
<TextField value={this.state.Age.toLocaleString()}
onChange={(_,age)=>this.handleChange('Age',parseInt(age||'0'))} 
/>
<Label>Score:</Label>
<Slider value={this.state.score}
min={0}
max={100}

onChange={(value)=>this.handleChange('score',value)}/>

<Label>Joining Date:</Label>
<DatePicker
maxDate={new Date()}
allowTextInput={false}
strings={DatePickerStrings}
formatDate={DateFormat}
ariaLabel='Select a date'

value={this.state.JoiningDate}
onSelectDate={(e:any)=>{this.setState({JoiningDate:e});}}
/>
<Label>Email Address:</Label>
<TextField
value={this.state.EmailAdd}
type="email"
onChange={(_,email)=>this.handleChange('EmailAdd',email||'')}
errorMessage={ValidateForm.EmailAdd}
/>
<Label>Phone Number:</Label>
<TextField value={this.state.PhoneNo}
onChange={(_,phoneno)=>this.handleChange('PhoneNo',parseInt(phoneno||'0'))}
errorMessage={ValidateForm.PhoneNo}/>
<br/>
<PrimaryButton onClick={()=>this.CreateData()} text='Save' iconProps={{iconName:'Save'}}/>
</>
    );
  }
}

export const DatePickerStrings:IDatePickerStrings={
  months:['January','February','March','April','May','June','July','August','September','October','November','December'],
  shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  goToToday:'Go To Today',
  prevMonthAriaLabel:'Go To Previous Month',
  nextMonthAriaLabel:'Go To Next Month',
  prevYearAriaLabel:'Go To Previous Year',
  nextYearAriaLabel:'Go To Next Year',
  invalidInputErrorMessage:'Invalid Date Format'
}

export const DateFormat=(date:any):string=>{
var date1=new Date(date);
var year=date1.getFullYear();
var month=(1+date1.getMonth()).toString();
month=month.length>1 ?month : '0'+month;
var day=date1.getDate().toString();
day=day.length>1 ? day:'0'+day;
return month + '/'+day+ '/'+ year;

}