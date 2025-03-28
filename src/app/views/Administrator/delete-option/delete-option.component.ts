import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from 'app/shared/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteActivityDto, DeleteMultiActivityDto } from 'app/views/Models/ActivityDto';
import { SafetyprecautionService } from 'app/shared/services/safetyprecautionservice';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { EmployeeService } from 'app/shared/services/employee.service';
import { TeamService } from 'app/shared/services/team.service';
import { DepartmentService } from 'app/shared/services/department.service';
import { RequestService } from 'app/shared/services/request.service';

@Component({
  selector: 'app-delete-option',
  templateUrl: './delete-option.component.html',
  styleUrls: ['./delete-option.component.css']
})
export class DeleteOptionComponent implements OnInit {

  Dto:DeleteActivityDto={
    id:null
  }
  MultiDto: DeleteMultiActivityDto= {
    ids: []
  }
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any[],private _snackBar: MatSnackBar,
  private activityservice:ActivityService,
  private subcontrservice:SubcontractorService,
  private empservice:EmployeeService,
  private teamsservice:TeamService,
  private deptservice:DepartmentService,
  private precautionservice:SafetyprecautionService,
  private reqservice:RequestService) { }

  ngOnInit(): void {
    this.data["payload"]
  }

  Delete()
  {
    this.Dto.id=this.data["payload"]['id'];
    this.MultiDto.ids = this.data["payload"];
    if(this.data['type']=='activity')
    {
         this.activityservice.DeleteActivity(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Record Deleted Successfully');

          });
    }

    else if(this.data['type']=='safety')
    {
         this.precautionservice.DeleteSafetyprecaution(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Record Deleted Successfully');

          });
    }
    else if(this.data['type']=='subcontractor')
    {
         this.subcontrservice.DeleteSubContractor(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Record Deleted Successfully');

          });
    }
    else if(this.data['type']=='emp')
    {
         this.empservice.DeleteEmployees(this.Dto).subscribe(res=>          
          {
            this.empservice.DeleteUser(this.Dto).subscribe(res=> {
              this.openSnackBar('User Deleted Successfully');
            });
          });
    }
    // else if(this.data['type']=='emp')
    // {
    //      this.empservice.DeleteUser(this.Dto).subscribe(res=>
    //       {
    //         this.openSnackBar('Record Deleted Successfully');
    //         console.log("delted Succeessfully");
    //       });
    // }
    else if(this.data['type']=='dept')
    {
         this.deptservice.DeleteDepartment(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Record Deleted Successfully');

          });
    }
    else if(this.data['type']=='team')
    {
         this.teamsservice.DeleteTeams(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Record Deleted Successfully');

          });
    }
    else if(this.data['type']=='request')
    {
         this.reqservice.DeleteRequest(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Request Deleted Successfully');

          });
    }
    else if(this.data['type']=='multirequest')
      {
           this.reqservice.DeleteMultiRequest(this.MultiDto).subscribe(res=>
            {
              this.openSnackBar('Request Deleted Successfully');
  
            });
      }
    else if(this.data['type']=='docs')
    {
         this.subcontrservice.DeleteSubContractorDocs(this.Dto).subscribe(res=>
          {
            this.openSnackBar('Request Deleted Successfully');

          });
    }
    // else if(this.data['type']=='emp')
    // {
    //      this.empservice.DeleteUser(this.Dto).subscribe(res=>
    //       {
    //         this.openSnackBar('Record Deleted Successfully');
    //         console.log("delted Succeessfully");
    //       });
    // }   
    
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000, 
    });
  }
}
