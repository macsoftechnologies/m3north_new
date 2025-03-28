import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { Router } from '@angular/router';
import { PrintDownloadOptions } from 'app/views/Models/PrintDownloadOptionsDto';
import * as moment from 'moment';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { RequestService } from 'app/shared/services/request.service';
import { PlansDto } from 'app/views/Models/PlansDto';
import { DatePipe } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { ExportExcelService } from 'app/shared/services/export-excel.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ListPopupComponent } from '../Requests/list-popup/list-popup.component';
import { config } from 'config';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  ModalOptions: PrintDownloadOptions;

  PlanForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  datefield: boolean = false;
  monthfield: boolean = false;
  yearfield: boolean = false;
  weekfield: boolean = false;
  ReqData: any[] = [];

  PlanTypes: any[] = [
    {
      PlanId: 1,
      PlanName: 'Daily Report'
    },
    {
      PlanId: 2,
      PlanName: 'Weekly Report'
    },
    // {
    //   PlanId: 3,
    //   PlanName: 'Monthly Plan'
    // }
  ];

  SubContractors: any[] = [];
  Sites: any[] = [];
  Weeks: any[] = [];
  Buildings: any[] = [];
  Years: any[] = [];
  WeekNumbers: any[] = [];
  date: Date;
   days_Names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthNames = [
    { id:1,Name: "January"}, 
    { id:2,Name: "February"}, 
    { id:3,Name: "March"}, 
    { id:4,Name: "April"}, 
    { id:5,Name: "May"}, 
    { id:6,Name: "June"}, 
    { id:7,Name: "July"}, 
    { id:8,Name: "August"}, 
    { id:9,Name: "September"}, 
    { id:10,Name: "October"}, 
    { id:11,Name: "November"}, 
    { id:12,Name: "December"}, 
  ];
    Cols = [
    { field: 'Company_Name', header: 'Company Name' },
    { field: 'subContractorName', header: 'Sub Contractor' },
    { field: 'Site_Id', header: 'Site' },
    { field: 'Building_Id', header: 'Building' },
    { field: 'Activity', header: 'Activity' },
    { field: 'PermitNo', header: 'Activity Permit No' },
    { field: 'Start_Time', header: 'Start Time' },
    { field: 'End_Time', header: 'End Time' },
    { field: 'Request_status', header: 'Status' },
    { field: 'Notes', header: 'Notes' },
    { field: 'Working_Date', header: 'Working Date' },
    { field: 'Day', header: 'Day' }

  ];

  plansDtodata: PlansDto = {
    // Plans_Id:null,
    Building_Id: null,
    Month: null,
    Week:null,
    Year:null,
    Site_Id:null,
    Date:null,
    // Site_Id:null,
    Sub_Contractor_Id: null,
    Room_Type: null,
    from_date: null,
    to_date: null,

    start_time: null,
    end_time: null,
   
  }
  Planslist: any[] = [];
  dataForExcel = [];
  empPerformance = [
    { ID: 10011, NAME: "A", DEPARTMENT: "Sales", MONTH: "Jan", YEAR: 2020, SALES: 132412, CHANGE: 12, LEADS: 35 },
    { ID: 10012, NAME: "A", DEPARTMENT: "Sales", MONTH: "Feb", YEAR: 2020, SALES: 232324, CHANGE: 2, LEADS: 443 },
    { ID: 10013, NAME: "A", DEPARTMENT: "Sales", MONTH: "Mar", YEAR: 2020, SALES: 542234, CHANGE: 45, LEADS: 345 },
    { ID: 10014, NAME: "A", DEPARTMENT: "Sales", MONTH: "Apr", YEAR: 2020, SALES: 223335, CHANGE: 32, LEADS: 234 },
    { ID: 10015, NAME: "A", DEPARTMENT: "Sales", MONTH: "May", YEAR: 2020, SALES: 455535, CHANGE: 21, LEADS: 12 },
  ];
  DownloadExcelData:any[]=[];
  ListWeeks: any[] = [];

  constructor(private fb: FormBuilder, private userservices: UserService,
    private route: Router,public ete: ExportExcelService,
    private subcontrservice: SubcontractorService,
    private requstservice: RequestService, private http: HttpClient,
    private dialog: MatDialog, 
    private datePipe: DatePipe) {
    const currentYear = new Date(config.Denmarktz).getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    for (let i = 2024; i < 2030; i++) {
      this.Years.push(i);
    }
    this.subcontrservice.GetAllSubContractors().subscribe(res => {
      this.SubContractors = res["data"];
    });

    this.requstservice.GetAllSites().subscribe(res => {
      this.Sites = res["data"];
      this.PlanForm.controls["Site"].setValue(res["data"][1]["site_name"]);
      this.plansDtodata.Site_Id=res["data"][1]["site_id"];
      this.GetBuilding(res["data"][1]["site_id"]);
    });
  }

  ngOnInit(): void {
    this.PlanForm = this.fb.group({
      Date: [''],
      Year: [''],
      Weekno: [''],
      Month: [''],
      Plantype: [''],
      subContractor: [''],
      Building: [''],
      Site: [''],
      level: [''],
      WorkingDateFrom: [''],
      WorkingDateTo: [''],
      StartTime: [''],
      EndTime: [''],
    });

    //     var current = new Date();     // get current date    
    // var weekstart = current.getDate() - current.getDay() +1;    
    // var weekend = weekstart + 6;       // end day is the first day + 6 
    // var monday = new Date(current.setDate(weekstart));  
    // var sunday = new Date(current.setDate(weekend));
  }

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
  //   'LTA'    
  // ]

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
     'MA Basement'
  ];


  Getselectedyear(event) {
    this.ListWeeks.length = 0;
    this.ListWeeks = [];
    this.PlanForm.controls["Weekno"].setValue("");
    let totalweeks = moment(event, "YYYY").isoWeeksInYear();
    for (let i = 1; i <= totalweeks; i++) {
      // this.WeekNumbers.push(i);
      this.getDateOfISOWeek(i, event);
    }
  }

  GetWeek(wknumber, year) {
    this.date = new Date(1, 1, 2020);
    this.date.setDate(this.date.getDate() + 1);
    console.log(this.date)
  }

  getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 7) {
      this.ListWeeks.push(this.datePipe.transform(ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1), 'yyyy/MM/dd') + "  -  " + this.datePipe.transform(ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay()), 'yyyy/MM/dd') + "  -  " + `${w}` );
      // console.log(this.datePipe.transform(ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1), 'yyyy-MM-dd'));
      // console.log(this.datePipe.transform(ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay()), 'yyyy-MM-dd'));
    }
    else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    return ISOweekStart;

  }

  GetselectedPlantype(event) {
    if (event == 1) {
      this.datefield = false;
      this.monthfield = true;
      this.yearfield = true;
      this.weekfield = true;
      this.PlanForm.controls["Date"].setValue("");
      this.PlanForm.controls["Month"].setValue("");
      this.PlanForm.controls["Year"].setValue("");
      this.PlanForm.controls["Weekno"].setValue("");
    }
    else if (event == 2) {
      this.datefield = true;
      this.monthfield = true;
      this.yearfield = false;
      this.weekfield = false;
      this.PlanForm.controls["Date"].setValue("");
      this.PlanForm.controls["Month"].setValue("");
      this.PlanForm.controls["Year"].setValue("");
      this.PlanForm.controls["Weekno"].setValue("");
    }
    if (event == 3) {
      this.datefield = true;
      this.monthfield = false;
      this.yearfield = false;
      this.weekfield = true;
      this.PlanForm.controls["Date"].setValue("");
      this.PlanForm.controls["Month"].setValue("");
      this.PlanForm.controls["Year"].setValue("");
      this.PlanForm.controls["Weekno"].setValue("");
    }
  }
  GetBuilding(event) {
    this.requstservice.GetAllBuildingsbyid(event).subscribe(res => {
      this.Buildings = res["data"];
    });
  }
  Getplans() {
    console.log(this.PlanForm.value)
  //  this.plansDtodata.Site_Id=this.PlanForm.controls["Site"].value;
    this.plansDtodata.Building_Id = this.PlanForm.controls["Building"].value;
    this.plansDtodata.Sub_Contractor_Id = this.PlanForm.controls["subContractor"].value;
    this.plansDtodata.Month = this.PlanForm.controls["Month"].value;
    this.plansDtodata.Date=this.datePipe.transform(this.PlanForm.controls["Date"].value, 'yyyy-MM-dd');
    this.plansDtodata.Year=this.PlanForm.controls["Year"].value;
    this.plansDtodata.Week=this.PlanForm.controls["Weekno"].value;
    this.plansDtodata.Room_Type=this.PlanForm.controls["level"].value;

    this.plansDtodata.from_date = this.datePipe.transform(this.PlanForm.controls["WorkingDateFrom"].value, 'yyyy-MM-dd');
    this.plansDtodata.to_date = this.datePipe.transform(this.PlanForm.controls["WorkingDateTo"].value, 'yyyy-MM-dd');

    this.plansDtodata.start_time = this.PlanForm.controls["StartTime"].value;
    this.plansDtodata.end_time = this.PlanForm.controls["EndTime"].value;


    //  this.plansDtodata.Plans_Id=this.PlanForm.controls["Plantype"].value;

    // if(this.PlanForm.controls["Plantype"].value==1)
    // {
    //    this.plansDtodata.fromDate=this.datePipe.transform(this.PlanForm.controls["Date"].value, 'yyyy-MM-dd');

    //    this.plansDtodata.toDate=this.datePipe.transform(this.PlanForm.controls["Date"].value, 'yyyy-MM-dd');
    //    console.log( this.plansDtodata)
    this.GetRequestData(this.plansDtodata);

    // }
    // else if(this.PlanForm.controls["Plantype"].value==2)
    // {
    //   var mydate=moment().year(2020).week(2);
    //   //console.log(mydate.format('YYYY-MM-DD'));
    //   console.log(mydate.startOf('week').format('YYYY-MM-DD'));
    //   console.log(mydate.endOf('week').format('YYYY-MM-DD'));

    //    this.plansDtodata.fromDate=mydate.startOf('week').format('YYYY-MM-DD');
    //     this.plansDtodata.toDate=mydate.endOf('week').format('YYYY-MM-DD');
    //     this.GetRequestData(this.plansDtodata);

    // }
    // else if(this.PlanForm.controls["Plantype"].value==3)
    // {
    //   var mymonthdate=moment().month(this.PlanForm.controls["Month"].value);
    //   this.plansDtodata.fromDate=mymonthdate.startOf("month").format('YYYY-MM-DD');
    //   this.plansDtodata.toDate=mymonthdate.endOf("month").format('YYYY-MM-DD');

    //   this.GetRequestData(this.plansDtodata);
    // }
  }

  GetRequestData(searchreq) {
    this.requstservice.GetPlans(this.plansDtodata).subscribe(res => {
      console.log(res);
      this.Planslist = res["data"];
    });
  }

//   exportToExcel() {

// // let base64_Img:any;

// // let workbook: ExcelProper.Workbook = new Excel.Workbook();

// // let worksheet = workbook.addWorksheet('Sales Data');

// //     worksheet.mergeCells('A1', 'M1');
// //     let titleRow = worksheet.getCell('C1');
// //     titleRow.value = "ACTIVITY PERMITS WEEK 20"
// //     titleRow.font = {
// //       name: 'Calibri',
// //       size: 16,
// //       underline: 'single',
// //       bold: true,
// //       color: { argb: '0085A3' }
// //     }
// //     titleRow.alignment = { vertical: 'middle', horizontal: 'center' }



// //     this.http.get('/assets/images/logo-beam.png', { responseType: 'blob' })
// //       .subscribe(res => {
// //         const reader = new FileReader();
// //         reader.onloadend = () => {
// //            base64_Img = reader.result;                
           
// //         }

// //         reader.readAsDataURL(res); 
// //         console.log(res);
// //       });
//   //     let myLogoImage = workbook.addImage({
      
//   //       base64: base64_Img,
//   //       extension: 'png',
//   //     });
//   // //  worksheet.mergeCells('A1:B4');
//   //   worksheet.addImage(myLogoImage, 'A1:B4');

//     // let headerRow = worksheet.addRow(this.Cols);
//     // headerRow.eachCell((cell, number) => {
//     //   cell.fill = {
//     //     type: 'pattern',
//     //     pattern: 'solid',
//     //     fgColor: { argb: '4167B8' },
//     //     bgColor: { argb: '' }
//     //   }
//     //   cell.font = {
//     //     bold: true,
//     //     color: { argb: 'FFFFFF' },
//     //     size: 12
//     //   }
//     // });

    

//     this.Planslist.forEach(x=>
//       {
//         var day=new Date(x["Working_Date"]).getDay()
//         console.log(this.days_Names[day]);
//         this.DownloadExcelData.push(
//           {Company_Name:x["Company_Name"],subContractorName:x["subContractorName"],Site_Id:x["Site_Id"],
//           Building_Id:x["Building_Id"],Activity:x["Activity"],PermitNo:x["PermitNo"],
//           Start_Time:x["Start_Time"],End_Time:x["End_Time"],Request_status:x["Request_status"],
//           Notes:x["Notes"],Working_Date:x["Working_Date"],Day:this.days_Names[day]}
//         )
//       });


//       // this.DownloadExcelData.forEach(d => {
//       //    worksheet.addRow(d);
//       // });
  
//       // workbook.xlsx.writeBuffer().then((data) => {
//       //   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       //   fs.saveAs(blob, "ACTIVITY PERMITS WEEK 20" + '.csv');
//       // })

//       // workbook.xlsx.writeBuffer().then( data => {
//       //   const blob = new Blob( [data], {type: "application/octet-stream"} );
//       //   saveAs( blob, 'ACTIVITY_PERMITS_WEEK_20.xlsx');
//       // });

//     const rowsString: string[] = [];
//     let headerString = '';
//     let csv = '';

//     this.ModalOptions = {
//       key: '',
//       fileName: '',
//       dialogHeader: '',
//       dialogMessage: '',
//       enableDownloadExcel: true,
//       enablePrint: true,
//       dataSource: '',
//       tableData: '',
//       columns: this.Cols,
//       reportHeaderColumns: '',
//       reportFooterColumns: ''

//     };

//     this.ModalOptions.tableData =  this.DownloadExcelData;

//     this.ModalOptions.fileName = "test" + "_" + moment(new Date()).format('YYYY/MM/DD').toString();

//     for (const column of this.ModalOptions.columns) {
//       let data = column.header;
//       data = data === 'undefined' ? '' : data;
//       data = data === null ? '' : data;
//       data = data === 'null' ? '' : data;
//       headerString += data + ',';

//     }
//     csv += headerString + '\n';

//     for (let i = 0; i < this.ModalOptions.tableData.length; i++) {
//       let rowString = '';
//       let colNames = '';
//       let objValues = {};
//       let val = '';

//       const tableRow = this.ModalOptions.tableData[i];
//       for (const column of this.ModalOptions.columns) {
//         if (column.field.includes('.')) {
//           colNames = column.field.split('.');
//           objValues = tableRow[colNames[0]];
//           val = String(objValues[colNames[1]])
//             .replace(/[\n\r]+/g, '')
//             .replace(/\s{2,}/g, ' ')
//             .replace(/,/g, '')
//             .trim();
//           val = val === 'true' ? '1' : val === 'false' ? '0' : val;
//           val = val === null ? '' : val;
//           val = val === 'null' ? '' : val;
//           val = val === '0' ? '' : val;
//           val = val === 'undefined' ? '' : val;
//           rowString += val + ',';
//         } else {
//           val = String(tableRow[column.field])
//             .replace(/[\n\r]+/g, '')
//             .replace(/\s{2,}/g, ' ')
//             .replace(/,/g, '')
//             .trim();
//           val = val === 'true' ? '1' : val === 'false' ? '0' : val;
//           val = val === null ? '' : val;
//           val = val === 'null' ? '' : val;
//           val = val === '0' ? '' : val;
//           val = val === 'undefined' ? '' : val;
//           rowString += val + ',';
//         }
//       }
//       rowsString.push(rowString);
//     }

//     for (const row of rowsString) {
//       csv += row + '\n';
//     }

//     csv += this.ModalOptions.reportFooterColumns + '\n';
//     const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.setAttribute('href', window.URL.createObjectURL(blob));
//     link.setAttribute(
//       'download',
//       this.ModalOptions.fileName + this.ModalOptions.key + '.csv'
//     );
//     document.body.appendChild(link); // Required for FF
//     link.click();
//   }


  exportToExcel() {
    this.DownloadExcelData.length=0;
    this.DownloadExcelData=[];
    this.dataForExcel.length=0;
    this.dataForExcel=[];
    this.Planslist.forEach(x=>
      {
        var day=new Date(x["Working_Date"]).getDay();
        // this.DownloadExcelData.push(
        //   {Company_Name:x["Company_Name"],ContractorName:x["subContractorName"],Level:x["Room_Type"],
        //   Building_Name:x["building_name"],Activity:x["Activity"],PermitNo:x["PermitNo"],
        //   Start_Time:x["Start_Time"],End_Time:x["End_Time"],Request_status:x["Request_status"],
        //   Notes:x["Notes"],Working_Date:x["Working_Date"],Day:this.days_Names[day], sub_Contractor_Name: x['subContractorName']}
        // )
        this.DownloadExcelData.push(
          {
            PermitNo: x["PermitNo"], ContractorName: x["subContractorName"], Sub_Contractor_Name: x['new_sub_contractor'], Building_Name: x["building_name"], Level: x["Room_Type"],
            Room_Nos: x['Room_Nos'], Activity: x["Activity"],description_of_activity: x["description_of_activity"], Rams_Number: x["rams_number"],HRAs: this.printHRAS(x),Auth:x[""],Comment: x[""],
            Start_Time: x["Start_Time"], End_Time: x["End_Time"], Night_Shift: this.nightShiftCheck(x), New_End_Time: x["new_end_time"], Request_status: x["Request_status"],
            Notes: x["Notes"], Working_Date: x["Working_Date"], Day: this.days_Names[day], New_Date: x["new_date"], New_Day: this.findNewDay(x),
          }
        )
      });

    this.DownloadExcelData.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    });

    let reportData = {
      title: 'PERMIT CO-ORDINATION SHEET',
      data: this.dataForExcel,
      headers: Object.keys(this.DownloadExcelData[0])
    }

    this.ete.exportExcel(reportData);
  }

  nightShiftCheck(rows) {
    return rows["night_shift"] == 1 ? 'Yes' : 'No';
  }

  findNewDay(row) {
    if (row["new_date"] && row["new_date"] !== "00-00-0000") {
      let newDate = new Date(row["new_date"]);
      let newDayIndex = newDate.getDay();
      return this.days_Names[newDayIndex];
    }
    return ""; // Return empty string if new_date is invalid
  }
  
  printHRAS(tableData) {
    let hrasValues = [];
    Object.entries(tableData).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      if ((key == "Hot_work" || key == "working_on_electrical_system" || key == "working_hazardious_substen" || key == "pressure_tesing_of_equipment" || key == "working_at_height" || key == "working_confined_spaces" || key == "work_in_atex_area" || key == "securing_facilities" || key == "excavation_works" || key == "using_cranes_or_lifting") && value == 1) {
        hrasValues.push(key)
      }
    });
    return hrasValues.toString();
  }

  Reset()
  {
    this.PlanForm.reset();
  }
  openPopUp(data) {
    let title = 'Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListPopupComponent, {
      width: '1200px',
      height: '600px',
      disableClose: false,
      data: { title: title, payload: data }
    });
  }
}
