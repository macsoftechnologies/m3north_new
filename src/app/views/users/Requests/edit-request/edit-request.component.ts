import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UpdateNotes, UpdateSafety, UpdateTime } from 'app/views/Models/MultiRequestUpdateDto';
import { RequestService } from 'app/shared/services/request.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafetyprecautionService } from 'app/shared/services/safetyprecautionservice';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {
  precaution:string="";
  Notes:string="";
  StartTime:any;
  EndTime:string="";
  night_shift: any;
  new_end_time: any;
  minDate: Date;
  maxDate: Date;
  IsNotes:boolean=false;
  IsSafety:boolean=false;
  IsTime:boolean=false;
  spinner:boolean=false;
  isnightshiftyes: boolean = false;
  EndTimeValidator: boolean = false;

  Safetypreselectable = true;
  safetyprecdata: any[] = [];
  safetyList: any[] = [];
  filteredsafety: Observable<any[]>;
  RequestForm: FormGroup;
  @ViewChild('badgeInput') badgeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  updatenotes:UpdateNotes=
  {
  id:null,
  Notes:null
  }
updatesafety:UpdateSafety=
{
  id:null,
  safety:null
}
updatetimes:UpdateTime=
{
  id:null,
  Start_Time:null,
  End_Time:null,
  night_shift: null,
  new_end_time: null
}

  constructor(private reqservice:RequestService,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EditRequestComponent>, private safetyservice: SafetyprecautionService,
  private datePipe: DatePipe,private _snackBar: MatSnackBar,private fb: FormBuilder)
  {
    
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
   
    this.safetyservice.GetSafetyprecautions().subscribe(res=>{
      this.safetyList=res["data"];
    });
  }
  ngOnInit(): void
  {

    this.RequestForm = this.fb.group({
      Safetyprecaustion: ['', Validators.required],
    });

    
    if(this.data["title"]=="notes")
    {
       this.IsNotes=true;
    }
    else if(this.data["title"]=="safetyPrecaution")
    {
      // this.filteredsafety = this.RequestForm.controls["Safetyprecaustion"].valueChanges
      // .pipe(
      //   startWith(''),
      //   map(val => val.length >= 1 ? this.filter(val) : [])
      // );

      // this.filteredsafety = this.RequestForm.controls["Safetyprecaustion"].valueChanges.pipe(
      //   startWith(null),
      //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.safetyList.slice()));
      
       this.IsSafety=true; 
    }
    else if(this.data["title"]=="Time")
    {
       this.IsTime=true;
    }
  }

  // filter(val: string) {
  //   return this.safetyList.filter(option =>
  //     option.precaution.toLowerCase().indexOf(val.toLowerCase()) === 0);
  // }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.safetyList.filter(fruit => fruit.precaution.toLowerCase().indexOf(filterValue) === 0);
  }

  CreateNotes()
  {
   
    this.spinner=true;
    this.updatenotes.Notes=this.Notes;
    this.updatenotes.id=this.data["payload"];
    this.reqservice.UpdateListReqstNote(this.updatenotes).subscribe(res=>
      {
        this.openSnackBar("Notes updated Successfully");
      this.spinner=false;
      });
  }
  CreateSafety()
  {
    // let safty=[];
    // this.safetyprecdata.forEach(res=>
    //   {
    //     safty.push(res["id"]);
    //   });
    // this.spinner=true;
    // this.updatesafety.safety=safty.toString();
     this.updatesafety.id=this.data["payload"];
    // console.log(this.updatesafety);
    this.updatesafety.safety=(this.RequestForm.controls["Safetyprecaustion"].value).toString();


    this.reqservice.UpdateListReqstSafety(this.updatesafety).subscribe(res=>
      {
        this.openSnackBar("Safety updated Successfully");
        this.spinner=false;
      });
  }

 
    toggleNightShift(isChecked: boolean) {
    this.isnightshiftyes = isChecked;
    this.updatetimes.night_shift = isChecked ? 1 : 0;
  }

  CreateTime()
  {
    this.spinner=true;
    console.log("..startTime", this.StartTime);
    console.log("...endTime", this.EndTime);
    console.log("...nightshift", this.night_shift);
    console.log("...new_end_time", this.new_end_time);
    if(this.StartTime && this.StartTime !== '' && this.StartTime !== undefined) {
       this.updatetimes.Start_Time=this.datePipe.transform(this.StartTime,'HH:mm');
    } else {
      delete this.updatetimes.Start_Time;
    }
    if(this.EndTime && this.EndTime !== '' && this.EndTime !== undefined) {
       this.updatetimes.End_Time=this.datePipe.transform(this.EndTime,'HH:mm');
    } else {
      delete this.updatetimes.End_Time;
    }
    // if(this.night_shift == 1 && this.night_shift !== undefined) {
    //    this.updatetimes.night_shift= this.night_shift;
    // } else {
    //   delete this.updatetimes.night_shift;
    // }
    if(this.new_end_time  && this.new_end_time !== '' && this.new_end_time !== undefined) {
       this.updatetimes.new_end_time = this.datePipe.transform(this.new_end_time,'HH:mm');
    } else {
      delete this.updatetimes.new_end_time;
    }
    console.log("...datapayload", this.data);
    this.updatetimes.id=this.data["payload"];
    console.log(".....updatetimes", this.updatetimes);
    if(this.updatetimes.Start_Time > this.updatetimes.End_Time) {
      this.EndTimeValidator = true;
    }

    if(!this.EndTimeValidator) {
         this.reqservice.UpdateListReqstTime(this.updatetimes).subscribe(res=>
      // {
      //   this.openSnackBar("Time updated Successfully");
      //   this.spinner=false;
      console.log("response....", res)
      )
    } else {
      this.openSnackBar("EndTime Should be greaterthan StartTime.");
      return ;
    }

 
  }


  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
    this.dialogRef.close();
  }
  selectedsafety(event: MatAutocompleteSelectedEvent): void {
    this.safetyList.forEach(x => {
      if (x["id"] == event.option.value) {
        this.safetyprecdata.push(x);
      }
    })
    //this.Rooms.push(event.option.viewValue);
   // this.badgeInput.nativeElement.value = '';
    this.RequestForm.controls["Safetyprecaustion"].setValue(null);
  }
  addsafety(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.safetyprecdata.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    // this.RequestForm.controls["Safetyprecaustion"].setValue(null);
    this.RequestForm.controls["Safetyprecaustion"].setValue(this.safetyprecdata);
  }

  removesafety(fruit: string): void {
    const index = this.safetyprecdata.indexOf(fruit);

    if (index >= 0) {
      this.safetyprecdata.splice(index, 1);
    }
  }


}

