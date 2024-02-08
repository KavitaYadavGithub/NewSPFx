import * as React from 'react';
// import styles from './FileUpload.module.scss';
import type { IFileUploadProps } from './IFileUploadProps';
import {sp} from "@pnp/sp/presets/all";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
export default class FileUpload extends React.Component<IFileUploadProps, any> {
constructor(props:any){
  super(props);

  this.state={
FirstName:"",
LastName:"",
Department:"" ,//Dropdown
EmployeementType:"", //Ye No
JoiningDate:"", //Date Time Picker
EmailId:"", //Email Type
PhoneNumber:"",//Number Type
LastEmployer:"",
Address:"", //Multiline Text
  }
  //Event handling
  this.handleChange=this.handleChange.bind(this);
  //resetform
  this.resetForm=this.resetForm.bind(this);
}
//Event handler
private handleChange(event:any){
  const target=event.target;
  const value=target.value;
  const name=target.name;
  this.setState({[name]:value});
}
//Regular Upload
// private regularFileUpload(myfile:File):Promise<void>{
//   return sp.web.getFolderByServerRelativeUrl("/sites/WebPartSample/Shared%20Documents/")
//   .files.add(myfile.name,myfile,true)
//   .then((f:any)=>{
//     console.log('File Uploaded');
//     return f.item.update({
//       Title:'Metadata Updated',
//       FirstName:this.state.FirstName,
//       LastName:this.state.LastName,
//       Department:this.state.Department,
//       EmployeementType:this.state.EmployeementType,
//       PhoneNumber:this.state.PhoneNumber,
//       EmailId:this.state.EmailId,
//       Address:this.state.Address,
//       JoiningDate:this.state.JoiningDate,
//       LastEmployer:this.state.LastEmployer
//     })
//     .then((myupdate:any)=>{
//       console.log(myupdate);
//       console.log("metadata is updated");
//       alert("Form is submitted successfully");
//     });
//   });
// }
private regularFileUpload(myfile:File):Promise<void>{
  return sp.web.getFolderByServerRelativeUrl("/sites/WebPartSample/Shared%20Documents/")
  .files.add(myfile.name,myfile,true)
  .then((f)=>{
    console.log('File Uploaded');
    return f.file.getItem().then((item)=>{
      return item.update({
        Title:'Metadata Updated',
        FirstName:this.state.FirstName,
        LastName:this.state.LastName,
        Department:this.state.Department,
        EmployeementType:this.state.EmployeementType,
        PhoneNumber:this.state.PhoneNumber,
        EmailId:this.state.EmailId,
        Address:this.state.Address,
        JoiningDate:this.state.JoiningDate,
        LastEmployer:this.state.LastEmployer
      })
      .then((myupdate)=>{
        console.log(myupdate);
        console.log("Metadata updated ");
        alert("Data successfully saved");
      })
    })
  })
}


//Cunked file upload

private chunkedFileUpload(myfile:File):Promise<void>{
  return sp.web.getFolderByServerRelativeUrl("/sites/WebPartSample/Shared%20Documents/")
  .files.addChunked(myfile.name,myfile)
  .then(({file})=>file.getItem())
  .then((item:any)=>{
    return item.update({
      Title:'Metadata Updated',
      FirstName:this.state.FirstName,
      LastName:this.state.LastName,
      Department:this.state.Department,
      EmployeementType:this.state.EmployeementType,
      PhoneNumber:this.state.PhoneNumber,
      EmailId:this.state.EmailId,
      Address:this.state.Address,
      JoiningDate:this.state.JoiningDate,
      LastEmployer:this.state.LastEmployer
    })
    .then((myupdate:any)=>{
      console.log(myupdate);
      console.log("metadata is updated"); 
      alert("Form is submitted successfully");
    });
  })
  .catch((err)=>{
    console.error("Error occurred");
    throw err;
  })
}
//Save Files
private fileSave=()=>{
  const inputFile=document.querySelector('#newfile') as HTMLInputElement|null;
  if(inputFile && inputFile.files && inputFile.files.length>0){
    const files=inputFile.files;
    const uploadPromises:Promise<void>[]=[];
    for(let i=0;i<files.length;i++){
      const myfile=files[i];
      if(myfile.size<=10485760){
        uploadPromises.push(this.regularFileUpload(myfile));
      }
      else{
        uploadPromises.push(this.chunkedFileUpload(myfile));
      }
    }
    //Execute all upload Promises Concurenly
    Promise.all(uploadPromises).then(()=>{
      console.log('All Files uploaded successfully');
    })
    .catch((err)=>{
      console.error("Erorr occrred");
      throw err;
    })
  }
}
//reset form
private resetForm=()=>{
  this.setState({
    FirstName:"",
LastName:"",
Department:"" ,//Dropdown
EmployeementType:"", //Ye No
JoiningDate:"", //Date Time Picker
EmailId:"", //Email Type
PhoneNumber:"",//Number Type
Address:"", //Multiline Text,
LastEmployer:''
  });
  const inpuFile=document.querySelector('#newFile') as HTMLInputElement|null;
  if(inpuFile){
    inpuFile.value=""
  }
}
  public render(): React.ReactElement<IFileUploadProps> {
  

    return (
    <section>
      <h1 className='text-center fs-4 text-primary '> Employee Joining Details Form</h1>
<div className='row'>
  <div className='col'>
    <div className='form-group'>
      <label htmlFor='FirstName' className='form-label fs-6'>First Name</label>
      <input type='text' id="FirstName" name="FirstName" value={this.state.FirstName}
      onChange={this.handleChange} className='form-control' />
    </div>
  </div>
  <div className='col'>
    <div className='form-group'>
      <label htmlFor='LastName' className='form-label fs-6'>Last Name</label>
      <input type='text' id="LastName" name="LastName" value={this.state.LastName}
      onChange={this.handleChange} className='form-control' />
    </div>
  </div>
</div>
<div className='row'>
  <div className='col'>
    <div className='form-group'>
      <label className='form-label fs-6'>Employeement Type</label>
      <div className='form-check'>
        <input type='radio' name='EmployeementType' value="Permanent"
        checked={this.state.EmployeementType==="Permanent"}
        onChange={this.handleChange} className='form-check-input'/>
        <label className='form-check-label'>Permanent</label>
      </div>
      <div className='form-check'>
      <input type='radio' name='EmployeementType' value="Contract"
        checked={this.state.EmployeementType==="Contract"}
        onChange={this.handleChange} className='form-check-input'/>
        <label className='form-check-label'>Contract</label>
      </div>
    </div>
  </div>
  </div>
  <div className='row'>
    <div className='col'>
      <div className='form-group'>
        <label htmlFor='Department' className='form-label fs-6'>Department</label>
        <select id='Department' name='Department' onChange={this.handleChange}
        className='form-control'>
          <option value="">Select Dropdown</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
    </div>
  </div>
  <div className='row'>
    <div className='col'>

      <div className='form-group'>
        <label htmlFor='EmailId' className='form-label fs-6'>Email ID</label>
        <input type='email' name='EmailId' id='EmailId' value={this.state.EmailId}
        onChange={this.handleChange} className='form-control'/>
      </div>
    </div>
    <div className='col'>

<div className='form-group'>
  <label htmlFor='JoiningDate' className='form-label fs-6'>Joining Date</label>
  <input type='date' name='JoiningDate' id='JoiningDate' value={this.state.JoiningDate}
  onChange={this.handleChange} className='form-control'/>
</div>
</div>
  </div>
  <div className='row'>
    <div className='col'>

      <div className='form-group'>
        <label htmlFor='LastEmployer' className='form-label fs-6'>Last Employer</label>
        <input type='text' name='LastEmployer' id='LastEmployer' value={this.state.LastEmployer}
        onChange={this.handleChange} className='form-control'/>
      </div>
    </div>
    <div className='col'>

<div className='form-group'>
  <label htmlFor='PhoneNumber' className='form-label fs-6'>Phone Number</label>
  <input  name='PhoneNumber' id='PhoneNumber' value={this.state.PhoneNumber}
  onChange={this.handleChange} className='form-control'/>
</div>
</div>
  </div>
  <div className='form-group'>
    <div className='mb-3'>
      <label htmlFor='Address' className='form-label fs-6'>Complete Address</label>
      <textarea name='Address' id='Address' value={this.state.Address}
      onChange={this.handleChange} className='form-control' rows={5}/>
    </div>
  </div>
  <div className='form-group'>
    <div className='mb-3'>
      <label htmlFor='formfile' className='form-label fs-6'>Upload Document</label>
      <input type='file' name ='myfile' id='newfile' className='form-control'/>
    </div>
  </div>
<button onClick={this.fileSave} className='btn btn-success' type='submit'>Submit Form</button>

<button onClick={this.resetForm} className='btn btn-danger ms-2 ' type='submit'>Reset Form</button>
    </section>
    );
  }
}
