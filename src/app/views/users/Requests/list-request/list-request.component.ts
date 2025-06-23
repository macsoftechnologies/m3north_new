import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Subscription, forkJoin } from 'rxjs';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { UserService } from 'app/shared/services/user.service';
import { ListPopupComponent } from '../list-popup/list-popup.component';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import { PrintDownloadOptions } from 'app/views/Models/PrintDownloadOptionsDto';
import * as moment from 'moment';
import { CopyRequestComponent } from '../copy-request/copy-request.component';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { RequestService } from 'app/shared/services/request.service';
import { StatusChangeDialogComponent } from '../status-change-dialog/status-change-dialog.component';
import { RequestSaveOptionsDialogComponent } from '../request-save-options-dialog/request-save-options-dialog.component';
import { DeleteOptionComponent } from 'app/views/Administrator/delete-option/delete-option.component';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ActivityService } from 'app/shared/services/activity.service';
import { SearchRequestDto } from 'app/views/Models/SearchRequestDto';
import { DatePipe } from '@angular/common';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import {
  RequestsbyId,
  RequestBySubcontractorId,
} from 'app/views/Models/RequestDto';
import * as xlsx from 'xlsx';
import { EditRequestComponent } from '../edit-request/edit-request.component';
import { config } from 'config';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css'],
  animations: egretAnimations,
})
export class ListRequestComponent implements OnInit {
  [x: string]: any;
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  ModalOptions: PrintDownloadOptions;
  spinner = false;
  IsNotSubCntr: boolean = false;
  IsNotASubCntr: boolean = false;
  selected = [];
  selectedRequestIds = [];
  Filtertab: boolean = false;
  SelectionType = SelectionType;
  isUserLoggedIn: any;

  Countresult = [];

  dummyArray = [];

  minDate: Date;
  maxDate: Date;
  CurrentTime: Date;
  RequestlistForm: FormGroup;
  items: any[] = [];
  getItemSub: Subscription;
  Cols = [
    { field: 'PermitNo', header: 'Permit number' },
    { field: 'Activity', header: 'Activity' },
    { field: 'subContractorName', header: 'Sub Contractor' },
    { field: 'Working_Date', header: 'Working Date' },
    { field: 'Start_Time', header: 'Start Time' },
    { field: 'End_Time', header: 'End Time' },
    { field: 'Request_status', header: 'Status' },
  ];
  paginationCount: any;
  pagedatainfo: any;

  currentPage : any;

  // setPage(pageinfo) {
  //   console.log("pagination", pageinfo);
  //   let pagedatainfo = {
  //     start : 1,
  //     end : 50,
  //     page: pageinfo.offset + 1
  //   }

  //   this.requestservice.listpagination(pagedatainfo).subscribe((res) => {
  //     console.log("pageresp", res);
  //     this.spinner = false;

  //       if (res[0]["message"] == "No Requests Found") {
  //         this.items = [];
  //         this.Filtertab = false;
  //       }
  //       else {

  //         this.Filtertab = true;
  //         this.userdata = this.jwtauth.getUser();

  //         if (this.userdata["role"] == "Subcontractor") {
  //           this.isoperator = false;
  //           this.IsNotSubCntr=false;
  //           this.RequestlistForm.controls["Contractor"].setValue(this.userdata["typeId"]);
  //           this.RequestsbyidDto.SubContractorId=this.userdata["typeId"];
  //           this.requestservice.GetAllRequestsByid(this.RequestsbyidDto).subscribe(res=>
  //             {
  //               this.items=res["data"];
  //             });
  //         }
  //         else if (this.userdata["role"] == "Admin") {
  //           this.IsNotSubCntr=true;
  //           this.items = res[0]["data"];
  //           this.isoperator = true;
  //           this.isoperator = true;
  //           var filteritems = [];
  //           this.items.forEach(x => {
  //             if (x["Request_status"] != "Draft") {
  //               filteritems.push(x);
  //             }
  //           });
  //           this.items = [];
  //           this.items.length = 0;
  //           this.items = filteritems;

  //         }
  //         else if (this.userdata["role"] == "Department") {
  //           this.IsNotSubCntr=true;
  //           this.items = res[0]["data"];
  //           this.isoperator = true;
  //           var filteritems = [];
  //           this.items.forEach(x => {
  //             if (x["Request_status"] != "Draft") {
  //               filteritems.push(x);
  //             }
  //           });
  //           this.items = [];
  //           this.items.length = 0;
  //           this.items = filteritems;
  //         }
  //       }

  //       this.Contractors = res[1]["data"];
  //       this.Sites = res[2]["data"];
  //       this.Getbuilding(this.Sites[1]["site_id"]);
  //       this.Typeofactivitys = res[3]["data"];
  //   })
  // }

  // getFloors = [
  //   'LK1',
  //   'L00',
  //   'L01',
  //   'L02',
  //   'L03',
  //   'L04',
  //   'L05',
  //   'L06',
  //   'L07',
  //   'L08',
  //   'LTA',
  // ];

    getFloors = [
      'External Areas',
      'Ground Floor',
      'First Floor',
      'Second Floor',
      'Third Floor',
      'Roof Plan',
      'MU90.0',
      'MU90.1',
      'MU90.2',
      'MU90.R',
      'MU91.0',
      'MU91.1',
      'MU91.2',
      'MU91.3',
      'MU91.4',
      'MU91.R',
      'MB.0',
      'MB.1',
      'MB.2',
      'MB.R',
      'MA.II 0',
      'MA.II 1',
      'MA.II 2',
      'MA.II 3',
      'MA.II R',
      'MA.III 0',
      'MA.III 1',
      'MA.III 2',
      'MA.III 3',
      'MA.III R',
      'MA Basement'
  ];

  getHras = [
    {
      "label": "Hotwork",
      "value": 1,
      "key": "Hot_work",
      "image": "assets/images/logos/HotWorks.png"
    },
    {
      "label": "Electrical Systems",
      "value": 1,
      "key": "working_on_electrical_system",
       "image": "assets/images/logos/ElectricalSystems.png"
    },
    {
      "label": "Hazardous Substances/Chemicals",
      "value": 1,
      "key": "working_hazardious_substen",
      "image": "assets/images/logos/substanceChemical.png"
    },
    {
      "label": "Pressure testing of equipment",
      "value": 1,
      "key": "pressure_tesing_of_equipment",
      "image": "assets/images/logos/testingequipment.png"
    },
    {
      "label": "Working At Height",
      "value": 1,
      "key": "working_at_height",
      "image": "assets/images/logos/WorkingAtHight.png"
    },
    {
      "label": "Confined Spaces",
      "value": 1,
      "key": "working_confined_spaces",
      "image": "assets/images/logos/ConfinedSpace.png"
    },
    {
      "label": "Working in ATEX Area",
      "value": 1,
      "key": "work_in_atex_area",
      "image": "assets/images/logos/ATEXarea.png"
    },
    {
      "label": "Securing Facilities (LOTO)",
      "value": 1,
      "key":"securing_facilities",
      "image": "assets/images/logos/SecuringFacilities.png"
    },
    {
      "label": "Excavation Works",
      "value": 1,
      "key": "excavation_works",
      "image": "assets/images/logos/ExcavationWorks.png"
    },
    {
      "label": "Using Crane or Lifting",
      "value": 1,
      "key": "using_cranes_or_lifting",
      "image": "assets/images/logos/Craneslifting.png"
    },
    
  ];

  getTaskSpecific = [
    // {
    //   "label": "SpecificGloves",
    //   "value": 1,
    //   "key": "specific_gloves",
    //   "image": "assets/images/safetyIcons/SpecificGloves.png"
    // },
    {
      "label": "Eye Protection",
      "value": 1,
      "key": "eye_protection",
       "image": "assets/images/safetyIcons/Eyeprotection.png"
    },
    {
      "label": "Fall Protection",
      "value": 1,
      "key": "fall_protection",
      "image": "assets/images/safetyIcons/Fallprotection.png"
    },
    {
      "label": "Hearing Protection",
      "value": 1,
      "key": "hearing_protection",
      "image": "assets/images/safetyIcons/Hearingprotection.png"
    },
    {
      "label": "Respiratory Protection",
      "value": 1,
      "key": "respiratory_protection",
      "image": "assets/images/safetyIcons/Respiratoryprotection.png"
    },
 ];

  Typeofactivitys: any[] = [];
  Status: any[] = [
    {
      Statusid: 'Hold',
      Statusname: 'Hold',
    },
    {
      Statusid: 'Draft',
      Statusname: 'Draft',
    },
    {
      Statusid: 'Approved',
      Statusname: 'Approved',
    },
    {
      Statusid: 'Rejected',
      Statusname: 'Rejected',
    },
    {
      Statusid: 'Opened',
      Statusname: 'Opened',
    },
    {
      Statusid: 'Closed',
      Statusname: 'Closed',
    },
    {
      Statusid: 'Cancelled',
      Statusname: 'Cancelled',
    },
  ];
  TypeS: any[] = [
    {
      Typeid: 1,
      Typename: 'T',
    },
    {
      Typeid: 2,
      Typename: 'S',
    },
    {
      Typeid: 3,
      Typename: 'C',
    },
  ];

  SearchRequest: SearchRequestDto = {
    Activity: null,
    Site_Id: null,
    Sub_Contractor_Id: null,
    Request_status: null,
    PermitNo: null,
    fromDate: '',
    toDate: '',
    Type_Of_Activity_Id: null,
    Building_Id: null,
    Room_Type: null,
    Start: null,
    End: null,
    Page: null,
    hras: '',
    taskSpecificPPE: '',
    area: '',
  };

  RequestsbyidDto: RequestBySubcontractorId = {
    SubContractorId: null,
  };
  Contractors: any[] = [];
  Sites: any[] = [];
  Buildings: any[] = [];
  userdata: any = {};
  isoperator: boolean = false;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private userservices: UserService,
    private route: Router,
    private fb: FormBuilder,
    private subcntrservice: SubcontractorService,
    private requestservice: RequestService,
    private activityservice: ActivityService,
    private datePipe: DatePipe,
    private jwtauth: JwtAuthService, private breakpointObserver: BreakpointObserver
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.requestservice.SelectedRequestData = {};
  }

  ngOnInit() {    
   
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.gridCols = 1; // Single column for extra small screens
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.gridCols = 2; // Two columns for small screens
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.gridCols = 2; // Three columns for medium screens
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.gridCols = 2; // Four columns for large screens
      }
    });

    let testing = [1,2,3]

    this.dummyArray = testing.filter((item) =>  {
     return item % 2 === 0
    }) 

    // console.log(this.dummyArray, 'array')

    this.api = 'listpagination';

    this.isUserLoggedIn = JSON.parse(localStorage.getItem('m3north_EGRET_USER'));
    console.log(this.isUserLoggedIn,"admin");

    this.currentPage = 1;

    this.startValue = 1;
    
    this.getPermits(this.currentPage, this.startValue);
    
    console.log("permitsonit", this.currentPage, this.startValue)

    console.log(this.CurrentTime, 'TIME');
    console.log(Date(), 'DATE');
    // var d = new Date();
    // var n = d.toLocaleString('da-DK', {
    //   timeZone: "Europe/Copenhagen",
    // });

    // this.getItems();
    this.RequestlistForm = this.fb.group({
      Permitnumber: ['', Validators.required],
      TypeOfActivity: ['', Validators.required],
      Keyword: ['', Validators.required],
      WorkingDateFrom: ['', Validators.required],
      WorkingDateTo: ['', Validators.required],
      Status: ['', Validators.required],
      Contractor: ['', Validators.required],
      Site: ['', Validators.required],
      Building: ['', Validators.required],
      Level: ['', Validators.required],
      Hras: ['',],
      TaskSpecific:['',],
      area: ['',]

    });
        const buildingData = this.requestservice.generateBulidFloorData();
    this.getRooms = this.extractGroupedZoneData(buildingData);
  }
     extractGroupedZoneData(data: any[]): any[] {
  const result = [];
  data.forEach(plan => {
    plan.zoneList.forEach(zone => {
      result.push({
        floorName: zone.floorName,
        zones: zone.zoneSubList.map(sub => ({
          value: sub.value,
          className: sub.className
        }))
      });
    });
  });
  return result;
}
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getPermits(page,value) {

    this.pagedatainfo = {
      LoginType: this.isUserLoggedIn.role,
      Type: this.isUserLoggedIn.typeId,
      user_id: this.isUserLoggedIn.id,
      Start: value,
      End: 30,
      Page: page,
    };

    console.log("Get Permits called start", this.pagedatainfo.Start);
    console.log("get page", this.pagedatainfo.Page)

    this.requestservice.listpagination(this.pagedatainfo).subscribe((res) => {
      console.log('pageresp', res);
      this.spinner = false;

      if (res[0]['message'] == 'No Requests Found') {
        this.items = [];
        this.Filtertab = false;
      } else {
        this.Filtertab = true;
        this.userdata = this.jwtauth.getUser();

        if (this.userdata['role'] == 'Subcontractor') {
          this.isoperator = false;
          this.IsNotSubCntr = false;
          this.IsNotASubCntr = false;
          this.RequestlistForm.controls['Contractor'].setValue(
            this.userdata['typeId']
          );
          this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
          // this.requestservice
          //   .GetAllRequestsByid(this.RequestsbyidDto)
          //   .subscribe((res) => {
          this.items = res[0]['data'];
          console.log("Total Data", this.items)
          // });
          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
        } else if (this.userdata['role'] == 'Admin') {
          this.IsNotSubCntr = true;
          this.IsNotASubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = true;
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          // this.items = [];
          // this.items.length = 0;
          // this.items = filteritems;

          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
        } 
        else if (this.userdata['role'] == 'Department') {
          this.IsNotSubCntr = false;
          this.IsNotASubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
          // this.items = [];
          // this.items.length = 0;
          // this.items = filteritems;
        }
        else if (this.userdata['role'] == 'Observer') {
          this.IsNotSubCntr = false;
          this.IsNotASubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = false;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
          this.items = [];
          this.items.length = 0;
          this.items = filteritems;
        }
      }

      if (res[2] && Array.isArray(res[2]['subcontractors'])) {
        this.Contractors = res[2]['subcontractors']
          .filter(subcontractor => subcontractor?.subContractorName
          ) // Remove undefined/null values
          .sort((a, b) => a.subContractorName
          .localeCompare(b.subContractorName
          ));
      } else {
        this.Contractors = [];
      }
      this.Sites = res[0]['data'];
      this.Getbuilding(this.Sites[0]['site_id']);
      this.Typeofactivitys = res[3]['activities'];
      this.totalCount = res[1]['count']
      console.log(this.totalCount, "Count Total")
    });
  }


  getItems() {
    //this.items = this.userservices.RequestLists;
    this.spinner = true;

    forkJoin(
      this.requestservice.GetAllRequests(),
      this.subcntrservice.GetAllSubContractors(),
      this.requestservice.GetAllSites(),
      this.activityservice.GetAllActivites()
    ).subscribe((res) => {
      this.spinner = false;

      if (res[0]['message'] == 'No Requests Found') {
        this.items = [];
        this.Filtertab = false;
      } else {
        this.Filtertab = true;
        this.userdata = this.jwtauth.getUser();

        if (this.userdata['role'] == 'Subcontractor') {
          this.isoperator = false;
          this.IsNotSubCntr = false;
          this.RequestlistForm.controls['Contractor'].setValue(
            this.userdata['typeId']
          );
          this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
          this.requestservice
            .GetAllRequestsByid(this.RequestsbyidDto)
            .subscribe((res) => {
              this.items = res['data'];
            });
        } else if (this.userdata['role'] == 'Admin') {
          this.IsNotSubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = true;
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          this.items = [];
          this.items.length = 0;
          this.items = filteritems;
        } else if (this.userdata['role'] == 'Department') {
          this.IsNotSubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          this.items = [];
          this.items.length = 0;
          this.items = filteritems;
        }
      }

      this.Contractors = res[1]['data'];
      this.Sites = res[2]['data'];
      this.Getbuilding(this.Sites[1]['site_id']);
      this.Typeofactivitys = res[3]['data'];
    });
    // this.requestservice.GetAllRequests().subscribe(x=>
    //   {
    //     this.spinner=false;
    //     this.items=x["data"];
    //   });

    // this.subcntrservice.GetAllSubContractors().subscribe(x=>
    //   {
    //     this.Contractors=x["data"];
    //   });
    //   this.requestservice.GetAllSites().subscribe(x=>
    //     {
    //       this.Sites=x["data"];
    //     });
  }
  Getbuilding(event) {
    this.spinner = true;
    this.requestservice.GetAllBuildingsbyid(event).subscribe((x) => {
      this.spinner = false;
      this.Buildings = x['data'];
    });
  }

  openPopUp(data) {
    let title = 'Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListPopupComponent, {
      width: '1200px',
      height: '600px',
      disableClose: false,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getItems();
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }
  deleteItem(row) {
    this.confirmService
      .confirm({ message: `Delete ${row.name}?` })
      .subscribe((res) => {});
  }
  addrequest() {
    this.route.navigateByUrl('user/new-request');
  }

  search(event) {
    // this.SearchRequest = null;
    Object.keys(this.SearchRequest).forEach((key) => {
      this.SearchRequest[key] = null;
    });
    console.log("inSearh",this.currentPage);
    console.log("in search value", this.startValue);
    this.api = 'SearchRequest';
    console.log(event.page);
    let start;
    let offset = event.page - 1;
    if (offset === 0) {
      start = 1;
    } else if (offset > 0) {
      start = offset * 30 + 1;
    }
    console.log(offset, 'Set Value');
    console.log(start, 'start value');

    console.log(this.RequestlistForm.controls.Level, 'Level');
    this.spinner = true;
const statusValue = this.RequestlistForm.controls['Status'].value;
const statusArray = Array.isArray(statusValue) ? statusValue : [statusValue]; 

const formattedStatus = statusArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `'${val}'`)
  .join(',');

this.SearchRequest.Request_status = formattedStatus || ""; 

//     const statusArray = this.RequestlistForm.controls['Status'].value;
// this.SearchRequest.Request_status = statusArray.map((val: string) => `'${val}'`).join(',');
    // this.SearchRequest.Request_status =
    //   this.RequestlistForm.controls['Status'].value.toString();
    this.SearchRequest.Activity =
      this.RequestlistForm.controls['Keyword'].value;
    this.SearchRequest.PermitNo =
      this.RequestlistForm.controls['Permitnumber'].value;
    // this.SearchRequest.Site_Id = this.RequestlistForm.controls['Site'].value;
    this.SearchRequest.Site_Id = '5';
    this.SearchRequest.Building_Id =
      this.RequestlistForm.controls['Building'].value.toString();
    this.SearchRequest.Sub_Contractor_Id =
      this.RequestlistForm.controls['Contractor'].value.toString();
    var mydate = this.datePipe.transform(
      this.RequestlistForm.controls['WorkingDateFrom'].value,
      'yyyy-MM-dd'
    );
    var todate = this.datePipe.transform(
      this.RequestlistForm.controls['WorkingDateTo'].value,
      'yyyy-MM-dd'
    );
    this.SearchRequest.Type_Of_Activity_Id =
      this.RequestlistForm.controls['TypeOfActivity'].value.toString();
        // this.SearchRequest.Room_Type = this.RequestlistForm.controls['Level'].value.toString();
  const levelValue = this.RequestlistForm.controls['Level'].value;
const levelsArray = Array.isArray(levelValue) ? levelValue : [levelValue]; 

const formattedLevel = levelsArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `'${val}'`)
  .join(',');

this.SearchRequest.Room_Type = formattedLevel || ""; 

 const areaValue = this.RequestlistForm.controls['area'].value;
const areasArray = Array.isArray(areaValue) ? areaValue : [areaValue]; 

const formattedArea = areasArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `${val}`)
  .join('|');

this.SearchRequest.area = formattedArea || ""; 

//     const levelsArray = this.RequestlistForm.controls['Level'].value;
// this.SearchRequest.Room_Type = levelsArray.map((val: string) => `'${val}'`).join(',');
    this.SearchRequest.Start = this.startValue;
    this.SearchRequest.End = '30';
    this.SearchRequest.Page = this.currentPage;

    if (mydate != null) {
      this.SearchRequest.fromDate = mydate;
    } 
    else {
      this.SearchRequest.fromDate = '';
    }
    if (todate != null) {
      this.SearchRequest.toDate = todate;
    } 
    else {
      this.SearchRequest.toDate = '';
    }
    if(this.RequestlistForm.get("Hras").value.includes('none')) {
      this.SearchRequest.hras = 'none';
    }
     else {
      this.SearchRequest.hras = '';
    }
    if (this.RequestlistForm.get("Hras").value.length > 0 && !this.RequestlistForm.get("Hras").value.includes('none')){
      this.RequestlistForm.get("Hras").value.forEach(item =>{

        this.SearchRequest[item.key] = item.value.toString()
      })
    }
         const allTaskSpecificKeys = ['eye_protection', 'fall_protection', 'head_protection', 'gloves', 'hearing_protection']; // Add all possible keys here

    if(this.RequestlistForm.get("TaskSpecific").value.includes('none')) {
      this.SearchRequest.taskSpecificPPE = 'none';
      
      allTaskSpecificKeys.forEach(key => {
        delete this.SearchRequest[key];
      });
    }
     else {
      this.SearchRequest.taskSpecificPPE = '';
    }
    if (this.RequestlistForm.get("TaskSpecific").value.length > 0 && !this.RequestlistForm.get("TaskSpecific").value.includes('none')){
      this.RequestlistForm.get("TaskSpecific").value.forEach(item =>{
        console.log("item", item)
        this.SearchRequest[item.key] = item.value.toString()
      })
    }


    // this.SearchRequest = {
    //   Start : start,
    //   End : 50,
    //   Page: event.page
    // }

    console.log(event.page, 'CCCC');

    this.requestservice.SearchRequest(this.SearchRequest).subscribe((res) => {
      // , this.pagedatainfo
      if (res['message'] == 'No Requests Found') {
        this.items = [];
        this.Filtertab = true;
        this.spinner = false;
      } else {
        this.items = res[0]['data'];
        this.paginationCount = res[1]['count'];
        this.api = 'SearchRequest';
        this.Filtertab = true;
        this.spinner = false;
      }
    });
  }

  exportToExcel() {
    const rowsString: string[] = [];
    let headerString = '';
    let csv = '';

    this.ModalOptions = {
      key: '',
      fileName: '',
      dialogHeader: '',
      dialogMessage: '',
      enableDownloadExcel: true,
      enablePrint: true,
      dataSource: '',
      tableData: '',
      columns: this.Cols,
      reportHeaderColumns: '',
      reportFooterColumns: '',
    };

    this.ModalOptions.tableData = this.items;

    this.ModalOptions.fileName =
      'test' + '_' + moment(new Date()).format('YYYY/MM/DD').toString();

    for (const column of this.ModalOptions.columns) {
      let data = column.header;
      data = data === 'undefined' ? '' : data;
      data = data === null ? '' : data;
      data = data === 'null' ? '' : data;
      headerString += data + ',';
    }
    csv += headerString + '\n';

    for (let i = 0; i < this.ModalOptions.tableData.length; i++) {
      let rowString = '';
      let colNames = '';
      let objValues = {};
      let val = '';

      const tableRow = this.ModalOptions.tableData[i];
      for (const column of this.ModalOptions.columns) {
        if (column.field.includes('.')) {
          colNames = column.field.split('.');
          objValues = tableRow[colNames[0]];
          val = String(objValues[colNames[1]])
            .replace(/[\n\r]+/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/,/g, '')
            .trim();
          val = val === 'true' ? '1' : val === 'false' ? '0' : val;
          val = val === null ? '' : val;
          val = val === 'null' ? '' : val;
          val = val === '0' ? '' : val;
          val = val === 'undefined' ? '' : val;
          rowString += val + ',';
        } else {
          val = String(tableRow[column.field])
            .replace(/[\n\r]+/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/,/g, '')
            .trim();
          val = val === 'true' ? '1' : val === 'false' ? '0' : val;
          val = val === null ? '' : val;
          val = val === 'null' ? '' : val;
          val = val === '0' ? '' : val;
          val = val === 'undefined' ? '' : val;
          rowString += val + ',';
        }
      }
      rowsString.push(rowString);
    }

    for (const row of rowsString) {
      csv += row + '\n';
    }

    csv += this.ModalOptions.reportFooterColumns + '\n';
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute(
      'download',
      this.ModalOptions.fileName + this.ModalOptions.key + '.csv'
    );
    document.body.appendChild(link);
    link.click();
  }

  Editrow(row) {
    this.requestservice.SelectedRequestData = {
      payload: row,
      editform: true,
    };
    this.route.navigateByUrl('/user/new-request');

    // let title = 'Request';
    // let dialogRef: MatDialogRef<any> = this.dialog.open(NewRequestComponent, {
    //   width: '1200px',
    //   height: '600px',
    //   disableClose: false,
    //   data: { title: title, payload: row,editform:true }
    // })
    // dialogRef.afterClosed()
    //   .subscribe(res => {

    //   })
  }
  CopyRequest(row, status) {
    if (status == 'Closed') {
      row['Request_status'] = 'Hold';
      let currentdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      row['Request_Date'] = currentdate;
    }
    if (status == 'Draft') {
      row['Request_status'] = 'Draft';
    } else {
      row['Request_status'] = 'Hold';
    }
    let title = 'Copy Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CopyRequestComponent, {
      width: '1200px',
      height: '300px',
      disableClose: false,
      data: { title: title, payload: row, copyform: true },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (this.api == 'SearchRequest') {
        console.log("search API");
        // this.api = 'SearchRequest';
        // this.items = res[0]['data'];
        // this.paginationCount = res[1]['count'];
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.search(event);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
      }
      else {
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.getPermits(this.currentPage, this.startValue);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
      }
    });
  }

  ChangeStaus(row) {
    let title = 'Request Status Change ';
    let type = 'operartor';
    console.log(row);
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      StatusChangeDialogComponent,
      {
        width: '600px',
        height: '300px',
        disableClose: false,
        data: {
          title: title,
          payload: row,
          type: type,
          pagedatainfo: this.pagedatainfo,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (this.api == 'SearchRequest') {
        console.log("search API");
        // this.api = 'SearchRequest';
        // this.items = res[0]['data'];
        // this.paginationCount = res[1]['count'];
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.search(event);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
      }
      else {
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.getPermits(this.currentPage, this.startValue);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
        // window.location.reload();
      }
      // this.requestservice.listpagination(this.pagedatainfo).subscribe((x) => {
        // console.log('New Req List', x);
        // const mainValue = this.currentPage - 1;
        // this.startValue = mainValue * 30 + 1 ;
        // this.getPermits(this.currentPage, this.startValue);
        // console.log("NUMMBER", this.currentPage)
        // console.log("Start Value", this.startValue)
        // this.openSnackBar("Request Status Updated Successfully");
        // window.location.reload();
      // });
    });
  }
  ChangeStausbysubcontractor(row, status) {
    console.log(config.Denmarktz.split(' '));
    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(' '),
    ];
    console.log(currentDenmarkTime);
    console.log(currentDenmarkDate);
    let title = 'Request Status Change ';
    let type = status;
    if (status == 'Opened') {
      var currentdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      var mydate = this.datePipe.transform(row['Working_Date'], 'yyyy-MM-dd');
      if (currentdate === mydate) {
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          StatusChangeDialogComponent,
          {
            disableClose: false,
            width: '600px',
            data: { title: title, payload: row, type: type },
          }
        );
        dialogRef.afterClosed().subscribe((res) => {
          if (this.api == 'SearchRequest') {
            console.log("search API");
            // this.api = 'SearchRequest';
            // this.items = res[0]['data'];
            // this.paginationCount = res[1]['count'];
            const mainValue = this.currentPage - 1;
            this.startValue = mainValue * 30 + 1;
            this.search(event);
            console.log("NUMMBER", this.currentPage)
            console.log("Start Value", this.startValue)
          }
          else {
            const mainValue = this.currentPage - 1;
            this.startValue = mainValue * 30 + 1;
            this.getPermits(this.currentPage, this.startValue);
            console.log("NUMMBER", this.currentPage)
            console.log("Start Value", this.startValue)
          }
        });
      }
    } else if (status == 'Closed') {
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        StatusChangeDialogComponent,
        {
          disableClose: false,
          width: '600px',
          data: { title: title, payload: row, type: type },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (this.api == 'SearchRequest') {
          console.log("search API");
          // this.api = 'SearchRequest';
          // this.items = res[0]['data'];
          // this.paginationCount = res[1]['count'];
          const mainValue = this.currentPage - 1;
          this.startValue = mainValue * 30 + 1;
          this.search(event);
          console.log("NUMMBER", this.currentPage)
          console.log("Start Value", this.startValue)
        }
        else {
          const mainValue = this.currentPage - 1;
          this.startValue = mainValue * 30 + 1;
          this.getPermits(this.currentPage, this.startValue);
          console.log("NUMMBER", this.currentPage)
          console.log("Start Value", this.startValue)
        }
      });
    }
  }

  Deleterequest(row) {
    let title = 'Delete Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: row, type: 'request' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (this.api == 'SearchRequest') {
        console.log("search API");
        // this.api = 'SearchRequest';
        // this.items = res[0]['data'];
        // this.paginationCount = res[1]['count'];
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.search(event);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
      }
      else {
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.getPermits(this.currentPage, this.startValue);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue)
      }
    });
  }
  statuschange(statusdata) {
    this.selectedRequestIds.length = 0;

    this.selected.forEach((x) => {
      if (x['Request_status'] == 'Hold') {
        this.selectedRequestIds.push(x['id']);
      }
    });

    let title = 'Do you want ' + statusdata + ' Items';
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      RequestSaveOptionsDialogComponent,
      {
        width: '500px',
        height: '200px',
        disableClose: false,
        data: {
          title: title,
          payload: this.selectedRequestIds.toString(),
          statustype: statusdata,
          listitemsstatus: true,
        },
      }
    );
    console.log("before model opened", this.selectedRequestIds.length)
    dialogRef.afterClosed().subscribe((res) => {
      this.Countresult.length = 0
      this.selected.length = 0;
      this.selected = [];
      this.selectedRequestIds.length = 0;
      console.log("after model closed", this.selectedRequestIds.length)
      if (this.api == 'SearchRequest') {
        console.log("search API");
        // this.api = 'SearchRequest';
        // this.items = res[0]['data'];
        // this.paginationCount = res[1]['count'];
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.search(event);
        // console.log("NUMMBER", this.currentPage)
        // console.log("Start Value", this.startValue);
        // window.location.reload();
      }
      else {
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.getPermits(this.currentPage, this.startValue);
        // console.log("NUMMBER", this.currentPage)
        // console.log("Start Value", this.startValue);
        // this.Countresult.length = 0;
        // this.selected.length = 0;
        
        // this.ngOnInit();
      }
      // window.location.reload();
    });
  }

  onSelect({ selected }) {
    this.selected = selected;
    this.Countresult = this.selected.filter((filterdata) => filterdata.Request_status === 'Hold')
    // console.log(this.Countresult, "RESULTTTT")
    // console.log(this.Countresult.length, "count")

    //this.selected.splice(0, this.selected.length);
    //this.selected.push(...selected);
  }

  onActivate(event) {
    console.log(event);
  }

  DeleteDepart(row) {
    let title = 'Delete Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: row, type: 'request' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
    });
  }

  EditDraft(row) {
    console.log(row);
    this.requestservice.SelectedRequestData = {
      payload: row,
      editform: true,
    };
    this.route.navigateByUrl('/user/new-request');
  }

  isValidDateFormat(date: string | null | undefined): boolean {
    if (!date) return false; // Handle null, undefined, and empty string
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && date !== '0000-00-00';
  }
  
  getSelectedDelete() {
    this.selected.forEach((x) => {
        this.selectedRequestIds.push(x['id']);
    });
    let title = 'Delete Multiple Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: this.selectedRequestIds, type: 'multirequest' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.Countresult.length = 0;
      this.selectedRequestIds.length = 0;
      this.selectedRequestIds = [];
      if (this.api == 'SearchRequest') {
        // console.log("search API");
        // this.api = 'SearchRequest';
        // this.items = res[0]['data'];
        // this.paginationCount = res[1]['count'];
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.search(event);
        // console.log("NUMMBER", this.currentPage)
        // console.log("Start Value", this.startValue)
      }
      else {
        const mainValue = this.currentPage - 1;
        this.startValue = mainValue * 30 + 1;
        this.getPermits(this.currentPage, this.startValue);
        console.log("NUMMBER", this.currentPage)
        console.log("Start Value", this.startValue);
        // window.location.reload();
        this.selected.length = 0;
      }
    });
  }

  Getselected(event) {
    console.log(event);
    this.selected.forEach((x) => {
          if ((x['Request_status'] == 'Draft') ||(x['Request_status'] == 'Hold') || (x['Request_status'] =="Approved") || (x['Request_status'] =="Opened")) {
        this.selectedRequestIds.push(x['id']);
      }
    });

    if (event != 'none') {
      let title = event;
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        EditRequestComponent,
        {
          width: '800px',
          height: 'fit-content',
          disableClose: false,
          data: { title: title, payload: this.selectedRequestIds.toString() },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        this.Countresult.length = 0;
        this.selectedRequestIds.length = 0;
        this.selectedRequestIds = [];
        if (this.api == 'SearchRequest') {
          // console.log("search API");
          // this.api = 'SearchRequest';
          // this.items = res[0]['data'];
          // this.paginationCount = res[1]['count'];
          const mainValue = this.currentPage - 1;
          this.startValue = mainValue * 30 + 1;
          this.search(event);
          // console.log("NUMMBER", this.currentPage)
          // console.log("Start Value", this.startValue)
        }
        else {
          const mainValue = this.currentPage - 1;
          this.startValue = mainValue * 30 + 1;
          this.getPermits(this.currentPage, this.startValue);
          console.log("NUMMBER", this.currentPage)
          console.log("Start Value", this.startValue);
          window.location.reload();
          this.selected.length = 0;
        }
      });
    }
  }
  Reset() {
    this.api = 'listpagination';
    this.RequestlistForm.reset();
    this.SearchRequest.fromDate = null;
    this.SearchRequest.toDate = null;
    Object.keys(this.SearchRequest).forEach((key) => {
      this.SearchRequest[key] = null;
    });
    this.ngOnInit();
  }
  selectFn(info) {
    console.log(info);
  }
  onCheckboxChangeFn(event) {
    console.log(event, "EVENT DATA");
  }

  onPagination(event) {
    this.Countresult.length = 0
    this.currentPage = event.page;
    let start;
    console.log("Event Value", event)
    console.log("pagination",event.page)
    console.log("Current Page", this.currentPage)
    let offset = event.page - 1;
    console.log("Page Number", offset)
    if (offset === 0) {
      start = 1;
    } else if (offset > 0) {
      start = offset * 30 + 1;
    }
    console.log(offset, 'Set Value');
    console.log(start, 'start value');
    this.pagedatainfo = {
      LoginType: this.isUserLoggedIn.role,
      Type: this.isUserLoggedIn.typeId,
      Start: start,
      End: 30,
      Page: this.currentPage,
    };

    console.log("PAGENUM", this.pagedatainfo.Page)
    console.log("startValue", this.pagedatainfo.Start)

    if (this.api == 'listpagination') {
      this.requestservice[this.api](this.pagedatainfo).subscribe((res) => {
        console.log('pageresp', res);
        this.spinner = false;

        // if (res[0]["message"] == "No Requests Found") {
        //   this.items = [];
        //   this.Filtertab = false;
        // }
        if (res.length > 0) {
          this.Filtertab = true;
          this.userdata = this.jwtauth.getUser();

          if (this.userdata['role'] == 'Subcontractor') {
            // this.isoperator = false;
            // this.IsNotSubCntr = false;
            this.isoperator = false;
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = false;
            this.RequestlistForm.controls['Contractor'].setValue(
              this.userdata['typeId']
            );
            this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
            // this.requestservice
            //   .GetAllRequestsByid(this.RequestsbyidDto)
            //   .subscribe((res) => {
            this.items = res[0]['data'];
            // });
            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Admin') {
            // this.IsNotSubCntr = true;
            this.IsNotSubCntr = true;
            this.IsNotASubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });

            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Department') {
            // this.IsNotSubCntr = true;
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
            this.items = [];
            this.items.length = 0;
            this.items = filteritems;
          }else if (this.userdata['role'] == 'Observer') {
            // this.IsNotSubCntr = true;
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = true;
            this.items = res[0]?.['data'] || [];
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
          
            this.items = filteritems;
            this.paginationCount = res[1]?.count || 0;
            console.log('Observer Pagination Count:', this.paginationCount);
          }
        }

        this.Contractors = res['data'];
        this.Sites = res['data'];
        // this.Getbuilding(this.Sites["site_id"]);
        this.Typeofactivitys = res['data'];
      });
    } else if (this.api == 'SearchRequest') {
      // this.SearchRequest.Request_status =
      //   this.RequestlistForm.controls['Status'].value;
      const statusValue = this.RequestlistForm.controls['Status'].value;
const statusArray = Array.isArray(statusValue) ? statusValue : [statusValue]; 

const formattedStatus = statusArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `'${val}'`)
  .join(',');

this.SearchRequest.Request_status = formattedStatus || ""; 
//       const statusArray = this.RequestlistForm.controls['Status'].value;
// this.SearchRequest.Request_status = statusArray.map((val: string) => `'${val}'`).join(',');
      this.SearchRequest.Activity =
        this.RequestlistForm.controls['Keyword'].value;
      this.SearchRequest.PermitNo =
        this.RequestlistForm.controls['Permitnumber'].value;
      // this.SearchRequest.Site_Id = this.RequestlistForm.controls['Site'].value;
      this.SearchRequest.Site_Id = '5';
      this.SearchRequest.Building_Id =
        this.RequestlistForm.controls['Building'].value.toString();
      this.SearchRequest.Sub_Contractor_Id =
        this.RequestlistForm.controls['Contractor'].value.toString();
      var mydate = this.datePipe.transform(
        this.RequestlistForm.controls['WorkingDateFrom'].value,
        'yyyy-MM-dd'
      );
      var todate = this.datePipe.transform(
        this.RequestlistForm.controls['WorkingDateTo'].value,
        'yyyy-MM-dd'
      );
      this.SearchRequest.Type_Of_Activity_Id =
        this.RequestlistForm.controls['TypeOfActivity'].value.toString();
      // this.SearchRequest.Room_Type =
      //   this.RequestlistForm.controls['Level'].value.toString();
      const levelValue = this.RequestlistForm.controls['Level'].value;
const levelsArray = Array.isArray(levelValue) ? levelValue : [levelValue]; 

const formattedLevel = levelsArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `'${val}'`)
  .join(',');

this.SearchRequest.Room_Type = formattedLevel || ""; 
 const areaValue = this.RequestlistForm.controls['area'].value;
const areasArray = Array.isArray(areaValue) ? areaValue : [areaValue]; 

const formattedArea = areasArray
  .filter(val => val !== null && val !== undefined && val !== '') 
  .map((val: string) => `${val}`)
  .join('|');

this.SearchRequest.area = formattedArea || ""; 
//       const levelsArray = this.RequestlistForm.controls['Level'].value;
// this.SearchRequest.Room_Type = levelsArray.map((val: string) => `'${val}'`).join(',');
      this.SearchRequest.Start = start;
      console.log("start", start)
      this.SearchRequest.End = '30';
      this.SearchRequest.Page = this.currentPage;
      console.log("value", this.currentPage)

      this.requestservice[this.api](this.SearchRequest).subscribe((res) => {
        console.log('pageresp', res);
        this.spinner = false;

        // if (res[0]["message"] == "No Requests Found") {
        //   this.items = [];
        //   this.Filtertab = false;
        // }
        if (res.length > 0) {
          this.Filtertab = true;
          this.userdata = this.jwtauth.getUser();

          if (this.userdata['role'] == 'Subcontractor') {
            // this.isoperator = false;
            // this.IsNotSubCntr = false;
            this.isoperator = false;
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = false;
            this.RequestlistForm.controls['Contractor'].setValue(
              this.userdata['typeId']
            );
            this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
            // this.requestservice
            //   .GetAllRequestsByid(this.RequestsbyidDto)
            //   .subscribe((res) => {
                this.items = res[0]['data'];
              // });
            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Admin') {
            // this.IsNotSubCntr = true;
            this.IsNotSubCntr = true;
            this.IsNotASubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });

            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Department') {
            // this.IsNotSubCntr = true;
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
            this.items = [];
            this.items.length = 0;
            this.items = filteritems;
          }else if (this.userdata['role'] == 'Observer') {
            this.IsNotSubCntr = false;
            this.IsNotASubCntr = true;
            this.items = res[0]?.['data'] || [];
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
          
            this.items = filteritems;
            this.paginationCount = res[1]?.count || 0;
            console.log('Observer Pagination Count:', this.paginationCount);
          }
          
        }

        this.Contractors = res[2]['subcontractors'];
        this.Sites = res['data'];
        // this.Getbuilding(this.Sites["site_id"]);
        this.Typeofactivitys = res[3]['activities'];
      });
    }
  }
}
