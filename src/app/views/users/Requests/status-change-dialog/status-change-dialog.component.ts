import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditRequestDto, UpdateClose_Status } from 'app/views/Models/RequestDto';
import { RequestService } from 'app/shared/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-status-change-dialog',
  templateUrl: './status-change-dialog.component.html',
  styleUrls: ['./status-change-dialog.component.css']
})
export class StatusChangeDialogComponent implements OnInit {

  updaterequestdata: EditRequestDto =
  {
    userId:null,
    Request_Date: null,
    Company_Name: null,
    Sub_Contractor_Id: null,
    Foreman: null,
    Foreman_Phone_Number: null,
    Activity: null,
    Type_Of_Activity_Id: null,
    Working_Date: null,
    Start_Time: null,
    End_Time: null,
    Site_Id: null,
    Building_Id: null,
    Floor_Id: null,
    Room_Nos: null,
    Room_Type: null,
    Crane_Requested: null,
    Crane_Number: null,
    Tools: null,
    Machinery: null,
    Hot_work: null,
    Certified_Person: null,
    LOTO_Procedure: null,
    LOTO_Number: null,
    Power_Off_Required: null,
    Number_Of_Workers: null,
    Badge_Numbers: null,
    Notes: null,
    Request_status: null,
    PermitNo: null,
    id: null,
    Assign_End_Time: null,
    Assign_Start_Time: null,
    Special_Instructions: null,
    Safety_Precautions: null
  }
  
  Close_Request:UpdateClose_Status=
  {
    id:null,
    Image:null,
    Request_status:null
  }
  userdata:any={};

  type:string="";
  croppedImage:string="";
  isclose:boolean=false;
  isimguploaded:boolean=false;
  spinner:boolean=false;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
   private requestdataservice:RequestService, private _snackBar: MatSnackBar,
   private authservice:JwtAuthService) { 

    this.userdata=this.authservice.getUser();
   }

  ngOnInit(): void {
    this.updaterequestdata.userId=this.userdata["id"];
    this.type=this.data["type"];
    this.updaterequestdata.Activity=this.data["payload"]["Activity"];
    this.updaterequestdata.Assign_Start_Time=this.data["payload"]["Assign_Start_Time"];
    this.updaterequestdata.Badge_Numbers=this.data["payload"]["Badge_Numbers"];
    this.updaterequestdata.Building_Id=this.data["payload"]["Building_Id"];
    this.updaterequestdata.Certified_Person=this.data["payload"]["Certified_Person"];
   this.updaterequestdata.Company_Name=this.data["payload"]["Company_Name"];

   this.updaterequestdata.Crane_Number=this.data["payload"]["Crane_Number"];
   this.updaterequestdata.Crane_Requested=this.data["payload"]["Crane_Requested"];
   this.updaterequestdata.End_Time=this.data["payload"]["End_Time"];
   this.updaterequestdata.Floor_Id=this.data["payload"]["Floor_Id"];
   this.updaterequestdata.Foreman=this.data["payload"]["Foreman"];
  this.updaterequestdata.Foreman_Phone_Number=this.data["payload"]["Foreman_Phone_Number"];


  this.updaterequestdata.Hot_work=this.data["payload"]["Hot_work"];
  this.updaterequestdata.LOTO_Number=this.data["payload"]["LOTO_Number"];
  this.updaterequestdata.LOTO_Procedure=this.data["payload"]["LOTO_Procedure"];
  this.updaterequestdata.Machinery=this.data["payload"]["Machinery"];
  this.updaterequestdata.Notes=this.data["payload"]["Notes"];
 this.updaterequestdata.Number_Of_Workers=this.data["payload"]["Number_Of_Workers"];


 this.updaterequestdata.PermitNo=this.data["payload"]["PermitNo"];
 this.updaterequestdata.Power_Off_Required=this.data["payload"]["Power_Off_Required"];
 this.updaterequestdata.Request_Date=this.data["payload"]["Request_Date"];
 this.updaterequestdata.Request_status=this.data["payload"]["Request_status"];
 this.updaterequestdata.Room_Nos=this.data["payload"]["Room_Nos"];
this.updaterequestdata.Room_Type=this.data["payload"]["Room_Type"];

this.updaterequestdata.Safety_Precautions=this.data["payload"]["Safety_Precautions"];
this.updaterequestdata.Site_Id=this.data["payload"]["Site_Id"];
this.updaterequestdata.Special_Instructions=this.data["payload"]["Special_Instructions"];
this.updaterequestdata.Start_Time=this.data["payload"]["Start_Time"];
this.updaterequestdata.Sub_Contractor_Id=this.data["payload"]["Sub_Contractor_Id"];
this.updaterequestdata.Tools=this.data["payload"]["Tools"];

this.updaterequestdata.Type_Of_Activity_Id=this.data["payload"]["Type_Of_Activity_Id"];
this.updaterequestdata.Working_Date=this.data["payload"]["Working_Date"];
this.updaterequestdata.id=this.data["payload"]["id"];

console.log(this.updaterequestdata)
  }

  Changestatus(statusdata)
  {
    if(statusdata=="Closed")
    {
      this.isclose=true;
    }
    else
    {
      this.isclose=false;
      this.updaterequestdata.Request_status=statusdata;
      console.log(this.updaterequestdata);
      this.requestdataservice.UpdateRequest(this.updaterequestdata).subscribe(x=>
        
        {
              this.openSnackBar("Request Status Updated Successfully");
              
            },
              error => {
                this.openSnackBar("Something went wrong. Plz try again later...");
              }
        )
    }
   
  }
  Changestatusbysubcontractor(status)
  {
     this.spinner=true;
  this.Close_Request.id=this.updaterequestdata.id;
  this.Close_Request.Request_status=status;
  this.Close_Request.Image= this.croppedImage;

  this.requestdataservice.CloseRequest(this.Close_Request).subscribe(res=>
    {
      this.openSnackBar("Request Status Updated Successfully");
      this.spinner=false;
    },
      error => {
        this.spinner=false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
)

  }
  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
  }

  csvInputChange(fileInputEvent: any) {
    var file=fileInputEvent.target.files[0];
    var reader = new FileReader();
  this.isimguploaded=true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.croppedImage = reader.result;
  }
  
}