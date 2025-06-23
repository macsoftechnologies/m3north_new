import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { DepartmentService } from 'app/shared/services/department.service';
import { SubcontractorDto, UpdateSubcontractorDto } from 'app/views/Models/Subcontractor';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-contractor',
  templateUrl: './sub-contractor.component.html',
  styleUrls: ['./sub-contractor.component.css']
})
export class SubContractorComponent implements OnInit {
  spinner = false;
  SubcontractorForm: FormGroup;
  croppedImage: string = "";
  Departments: any[] = [];
  Editform: boolean = false;
  upload_imgsty: string = "";
  editcroppedImage: string = "";
  subcontr: SubcontractorDto = {
    subContractorName: null,
    logo: null,
    departId: null,
    // username:null,
    // password:null
  }
  updatesubcontr: UpdateSubcontractorDto = {
    id: null,
    subContractorName: null,
    logo: null,
    departId: null,
    // username:null,
    // password:null
  }

  constructor(private fb: FormBuilder, private empservice: UserService, private _snackBar: MatSnackBar,
    private depservice: DepartmentService, private subcservice: SubcontractorService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any[],) {
    this.spinner = true;
    this.depservice.GetAllDepartments().subscribe(res => {
      this.spinner = false;
      this.Departments = res["data"];
    });

    this.SubcontractorForm = this.fb.group({
      subname: ['', [Validators.required]],
      department: ['', Validators.required],
      sublogo: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    if (this.data != null && this.data["editform"] == true) {
      this.Editform = true;
      var deptarr = this.data["payload"]["departId"];
      this.updatesubcontr.id = this.data["payload"]["id"];
      this.SubcontractorForm.controls["subname"].setValue(this.data["payload"]["subContractorName"]);
      this.SubcontractorForm.controls["sublogo"].setValue(this.data["payload"]["logo"]);
      this.SubcontractorForm.controls["department"].setValue(deptarr.split(','));
      this.croppedImage = this.data["payload"]["logo"];
      this.updatesubcontr.logo = "";

      this.editcroppedImage = "https://beam.safesiteworks.com/beamapi/services/subcontractor/images/" + this.data["payload"]["logo"];
    }
  }
  csvInputChange(fileInputEvent: any) {
    var file = fileInputEvent.target.files[0];
    var reader = new FileReader();

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.upload_imgsty = "uploadimgsty";

    if (reader.result.length >= 100000) {
      alert('File exceeds the 100kb size');
      this.upload_imgsty = "uploadimgsty-no-img";
      if (this.Editform == true) {
        this.upload_imgsty = "uploadimgsty";
        this.editcroppedImage = "https://safesiteworksbeam.online/beamapi/services/subcontractor/images/" + this.data["payload"]["logo"];
        this.croppedImage = "";
      }
      else {
        this.croppedImage = "";
      }
    }
    else {
      this.croppedImage = reader.result;
      if (this.Editform == true) {
        this.editcroppedImage = reader.result;
        this.croppedImage = this.editcroppedImage;
        this.updatesubcontr.logo = this.croppedImage;
      }
    }


  }
  Createsubcontractors() {
    let depts = this.SubcontractorForm.controls["department"].value;
    this.subcontr.departId = depts.toString();
    this.subcontr.subContractorName = this.SubcontractorForm.controls["subname"].value;
    this.subcontr.logo = this.croppedImage;

    //  this.subcontr.username=this.SubcontractorForm.controls["username"].value;
    //this.subcontr.password=this.SubcontractorForm.controls["password"].value;
    this.spinner = true;
    this.subcservice.CreateSubContractor(this.subcontr).subscribe(res => {
      this.spinner = false;
      this.openSnackBar("Subcontractor Created Successfully");
      this.SubcontractorForm.reset();
      this.croppedImage = "";
    },
      error => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );

  }
  Updatesubcrt() {
    this.spinner = true;
    let depts = this.SubcontractorForm.controls["department"].value;
    this.updatesubcontr.departId = depts.toString();
    this.updatesubcontr.subContractorName = this.SubcontractorForm.controls["subname"].value;
    //this.updatesubcontr.username=this.SubcontractorForm.controls["username"].value;
    //this.updatesubcontr.password=this.SubcontractorForm.controls["password"].value;
    // this.updatesubcontr.logo=this.croppedImage;

    this.subcservice.UpdateSubContractor(this.updatesubcontr).subscribe(res => {
      // debugger
      if (res["status"] == "200") {
        this.openSnackBar("Subcontractor Updated Successfully");
        window.location.reload();
      }
    },
      error => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    )
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
    this.spinner = false;
  }
}
