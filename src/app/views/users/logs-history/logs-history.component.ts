import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { LogsService } from 'app/shared/services/logs.service';
import { RequestService } from 'app/shared/services/request.service';
import { LogHistoryModelComponent } from 'app/views/Models/log-history-model/log-history-model.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.css']
})
export class LogsHistoryComponent implements OnInit {
  [x: string]: any;
  items: any;
  spinner = false;
  isUserLoggedIn: any;
  paginationCount: any;
  pagedatainfo: any;
  Countresult = [];

  currentPage : any;
  searchedPermitNumber: string;
  private searchSubject = new Subject<string>();

  constructor(private logsService: LogsService, private jwtauth: JwtAuthService, private requestservice: RequestService,  private dialog: MatDialog,) { }

  ngOnInit(): void {
    // this.GetAllLogsHistory();
    this.isUserLoggedIn = JSON.parse(localStorage.getItem('m3north_EGRET_USER'));
    this.currentPage = 1;

    this.startValue = 1;
    this.getPermits(this.currentPage, this.startValue);

    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      console.log('56456');
      this.getPermits(1,1);
      // console.log('Search Text:',   this.getPermits(this.currentPage, this.startValue););
      // Call your API or perform search logic here
    });

  }

  // GetAllLogsHistory() {
  //   this.spinner = true;
  //   this.logsService.GetAllLogsDetails().subscribe(res => {
  //     this.items = res["data"];
  //     // console.log("logs",this.items)
  //     this.spinner = false;
  //   });
  // }

  isValidDateFormat(date: string | null | undefined): boolean {
    if (!date) return false; // Handle null, undefined, and empty string
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && date !== '0000-00-00';
  }
  

  getPermits(page,value) {
    this.pagedatainfo = {
      LoginType: this.isUserLoggedIn.role,
      Type: this.isUserLoggedIn.typeId,
      Start: value,
      End: 30,
      Page: page,
      PermitNumber: this.searchedPermitNumber
    };

    console.log("Get Permits called start", this.pagedatainfo.Start);
    console.log("get page", this.pagedatainfo.Page)

    this.logsService.listpagination(this.pagedatainfo).subscribe((res) => {
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
        } else if (this.userdata['role'] == 'Department') {
          this.IsNotSubCntr = false;
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
          this.items = [];
          this.items.length = 0;
          this.items = filteritems;
        }
      }

      this.Contractors = res[2]['subcontractors'];
      this.Sites = res[0]['data'];
      // this.Getbuilding(this.Sites[0]['site_id']);
      this.Typeofactivitys = res[3]['activities'];
      this.totalCount = res[1]['count']
      console.log(this.totalCount, "Count Total")
    });
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
      this.requestservice.listpagination(this.pagedatainfo).subscribe((res) => {
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
            this.isoperator = false;
            this.IsNotSubCntr = false;
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

            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
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

        this.Contractors = res['data'];
        this.Sites = res['data'];
        // this.Getbuilding(this.Sites["site_id"]);
        this.Typeofactivitys = res['data'];
      });
  }
  logPermitNumberClick(permitNo){
    // console.log(permitNo)
    if (permitNo){
      this.spinner = true;
      this.logsService.getLogDataByPermitNumber(permitNo).subscribe((res) =>{
        // console.log("res", res)
        this.spinner = false;
        const dialogRef = this.dialog.open(LogHistoryModelComponent, {
          width: '700px',
          // height: '300px',
          data: {
            logData: res.data,
         }
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log(result, 'result');
        
        });

      })
    }

  }
  searchPermitData(){
    // this.getPermits(1,1);
    this.searchSubject.next();
  }
}
