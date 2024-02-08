import * as React from 'react';
import styles from './CrudOperations.module.scss';
import type { ICrudOperationsProps } from './ICrudOperationsProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import {PeoplePicker,PrincipalType} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import {Web} from '@pnp/sp/presets/all';
import { ICrudOperationState } from './ICrudOperationsState';
import { DatePicker, IDatePickerStrings } from '@fluentui/react/lib/DatePicker';
import { Label,TextField,PrimaryButton } from '@fluentui/react';

export default class CrudOperations extends React.Component<ICrudOperationsProps, ICrudOperationState> {
  constructor(props:any){
    super(props);
    this.state={
      Items:[],
      Title:'',
      JoiningDate:null,
      Manager:'',
      ManagerId:0,
      ID:0,
      HTML:[],
      // ContactNumber:null,
      Address:''
    }
  }
   public async componentDidMount(){
    await this.FetchData();
  }

  //Fetch data
  public async FetchData(){
    const web=Web(this.props.siteUrl);
    const items:any[]=await web.lists.getByTitle('Crud').items.select('*','Manager/Title').expand('Manager').get();
    console.log(items);

    this.setState({Items:items});
    let html=await this.getTable(items);
    this.setState({HTML:html});
  }

  public FindData=(id:any):void=>{
    var itemID=id;
    var allItems=this.state.Items;
    var allItemsLength=allItems.length;
    if(allItemsLength>0){
      for(var i=0;i<allItemsLength;i++){
        if(itemID==allItems[i].Id){
          this.setState({
            ID:itemID,
            Title:allItems[i].Title,
            JoiningDate:new Date(allItems[i].JoiningDate),
            Manager:allItems[i].Manager.Title,
            ManagerId:allItems[i].ManagerId,
            Address:allItems[i].Address

          })
        }
      }
    }
  }

  public async getTable(items:any){
    var tabledata=<table  className={styles.table}>
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Joining Date</th>
          <th> Reporting Manager</th>
          <th>Address</th>
        </tr>
      </thead>
<tbody>
  {items && items.map((item:any,i:any)=>{
    return[
      <tr key={i} onClick={()=>this.FindData(item.ID)}>
        <td>{item.Title}</td>
        <td>{DateFormat(item.JoiningDate)}</td>
        <td>{item.Manager.Title}</td>
        <td>{item.Address}</td>
      </tr>
    ]
  })}
</tbody>

    </table>
    return await tabledata;
  }
  //Create Data

  public async SaveData(){
    const web=Web(this.props.siteUrl);

    await web.lists.getByTitle('Crud').items.add({
      Title:this.state.Title,
      JoiningDate:new Date(this.state.JoiningDate),
      ManagerId:this.state.ManagerId,
      Address:this.state.Address,
      // ContactNumber:this.state.ContactNumber
    })
    .then((data)=>{
      console.log('No Error found');
      return data;
    })
    .catch((err)=>{
      console.error('Error occurred');
      throw err;
    });
    alert('Item has been successfully added');
    this.setState({
      Title:'',
      Manager:'',
      JoiningDate: null,
      Address: '',
      // ContactNumber: Number 
    })
this.FetchData();

  }

  //update data
  public async updatedata(){
    const web=Web(this.props.siteUrl);

    await web.lists.getByTitle('Crud').items.getById(this.state.ID).update({
      Title:this.state.Title,
      JoiningDate:new Date(this.state.JoiningDate),
      ManagerId:this.state.ManagerId,
      Address:this.state.Address,
      // ContactNumber:this.state.ContactNumber
    })
    .then((data)=>{
      console.log('No Error found');
      return data;
    })
    .catch((err)=>{
      console.error('Error occurred');
      throw err;
    });
    alert('Item has been successfully updated');
    this.setState({
      Title:'',
      Manager:'',
      JoiningDate: null,
      Address: '',
      // ContactNumber: Number 
    })
this.FetchData();

  }

  //Delete Data
  public async deleteData(){
    const web=Web(this.props.siteUrl);

    await web.lists.getByTitle('Crud').items.getById(this.state.ID).delete()
    .then((data)=>{
      console.log('No Error found');
      return data;
    })
    .catch((err)=>{
      console.error('Error occurred');
      throw err;
    });
    alert('Item has been successfully deleted');
    this.setState({
      Title:'',
      Manager:'',
      JoiningDate: null,
      Address: '',
      // ContactNumber: null 
    })
    this.FetchData();


  }

  //event Handling
  private handleChange=(fieldName:keyof ICrudOperationState,value:string|number|boolean):void=>{
    this.setState({[fieldName]:value} as unknown as Pick<ICrudOperationState, keyof ICrudOperationState>);

  }
  //Reset Data
  public async resetData(){
    this.setState({
      Title:'',
      Manager:'',
      JoiningDate: null,
      Address: '',
      // ContactNumber: null 
    })
  }

  //Get PeoplePicker

  private getPeoplePicker=(items:any[]):void=>{
    if(items.length>0){
      this.setState({
        Manager:items[0].text,
        ManagerId:items[0].id
      });
    
    }
    else{
      this.setState({
        Manager:'',
        ManagerId:''
      })
    }
  }
  public render(): React.ReactElement<ICrudOperationsProps> {


    return (
    <>
    <h1>Crud Operations Using React JS</h1>

{this.state.HTML}  

<div className={styles.btngroup}>
  <div><PrimaryButton text="Create" onClick={()=>this.SaveData()} iconProps={{iconName:'save'}}/></div>
  <div><PrimaryButton text="Update" onClick={()=>this.updatedata()} iconProps={{iconName:'edit'}}/></div>
  <div><PrimaryButton text="Delete" onClick={()=>this.deleteData()} iconProps={{iconName:'delete'}}/></div>
  <div><PrimaryButton text="Reset" onClick={()=>this.resetData()} iconProps={{iconName:'reset'}}/></div>

</div>
<div>
  <form>
    <div>
      <Label>Employee Name:</Label>
      <TextField value={this.state.Title}
      onChange={(_,title)=>this.handleChange("Title",title||'')}
      />

    </div>
    <div>
      <Label>
        Joining Date:
      </Label>
      <DatePicker
      maxDate={new Date()}
      allowTextInput={false}
      strings={DatePickerStrings}
      value={this.state.JoiningDate}
      onSelectDate={(e:any)=>{this.setState({JoiningDate:e})}}
      formatDate={DateFormat}
      ariaLabel='select Date'
      />
    </div>
    <div>
      <Label>Reporting Manager:</Label>
      <PeoplePicker
      context={this.props.context as any}
      personSelectionLimit={1}
      resolveDelay={1000}
      principalTypes={[PrincipalType.User]}
      defaultSelectedUsers={[this.state.Manager?this.state.Manager:'']}
      ensureUser={true}
      onChange={this.getPeoplePicker}

    
      />
    </div>
    <div>
      <Label>Address:</Label>
      <TextField value={this.state.Address}
      onChange={(_,address)=>this.handleChange("Address",address||'')}
      />
    </div>
  </form>
</div>
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