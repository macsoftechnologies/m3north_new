import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateRequestStatusListDto } from 'app/views/Models/RequestDto';
import { RequestService } from 'app/shared/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { getItems } from 'app/views/users/Requests/list-request'

@Component({
  selector: 'app-request-save-options-dialog',
  templateUrl: './request-save-options-dialog.component.html',
  styleUrls: ['./request-save-options-dialog.component.css']
})
export class RequestSaveOptionsDialogComponent implements OnInit {

  activityvalues: any[] = ["Yes", "No"];
  selectedValue: string = "";
  title: string = "";
  status: string = "";
  Listitemsstatus: boolean = false;
  req_ids: "";

  UpdateRequestStatusList: UpdateRequestStatusListDto =
    {
      Request_status: null,
      id: null,
      userId: null,
      ConM_initials: null,
      reject_reason: null,
    }
  userData: any = {};
  statusApprovedForm: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RequestSaveOptionsDialogComponent>,
    private reqservice: RequestService, private authservice: JwtAuthService,
    private _snackBar: MatSnackBar,
    private route: Router) {

    this.userData = this.authservice.getUser();
    
    this.statusApprovedForm = new FormGroup({
      ConM_initials: new FormControl('', Validators.required),
      reject_reason: new FormControl('', Validators.required),
    })
  }


  ngOnInit(): void {
    this.title = this.data["title"];
    this.status = this.data["statustype"];
    this.Listitemsstatus = this.data["listitemsstatus"];
    this.req_ids = this.data["payload"];
  }

  SaveHold(status): void {

    this.dialogRef.close({ data: status });
  }
  ChangeListStaus() {

    this.UpdateRequestStatusList.Request_status = this.status;
    this.UpdateRequestStatusList.id = this.req_ids;
    this.UpdateRequestStatusList.userId = this.userData["id"];

    if (this.statusApprovedForm.get('ConM_initials').valid) {
      this.UpdateRequestStatusList.ConM_initials = this.statusApprovedForm.value.ConM_initials;
    }
    if(this.statusApprovedForm.get('reject_reason').valid) {
      this.UpdateRequestStatusList.reject_reason = this.statusApprovedForm.value.reject_reason;
    }

    this.reqservice.UpdateListStatusRequest(this.UpdateRequestStatusList).subscribe(res => {
      this.openSnackBar("Requests Status Updated Successfully");
      // this.getItems();
      this.ngOnInit();
      this.route.navigateByUrl("/user/list-request");
    },
      error => {
        this.openSnackBar("something went wrong please try again later...");
      });
  }
  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }
}
