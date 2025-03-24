
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  EditRequestDto,
  UpdateClose_Status,
} from "app/views/Models/RequestDto";
import { RequestService } from "app/shared/services/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { config } from "config";
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-status-change-dialog",
  templateUrl: "./status-change-dialog.component.html",
  styleUrls: ["./status-change-dialog.component.css"],
})
export class StatusChangeDialogComponent implements OnInit {
  updaterequestdata: EditRequestDto = {
    userId: null,
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
    Safety_Precautions: null,
    teamId: null,
    createdTime: null,
    name_of_the_fire_watcher: null,
    phone_number_of_fire_watcher: null,
    tasks_in_progress_in_the_area: null,
    account_during_the_work: null,
    lighting_sufficiently: null,
    spesific_risks_based_on_task: null,
    work_environment_safety_ensured: null,
    course_of_action_in_emergencies: null,
    fire_watch_establish: null,
    combustible_material: null,
    extinguishers_and_fire_blanket: null,
    safety_measures: null,
    welding_activitiy: null,
    heat_treatment: null,
    air_extraction_be_established: null,
    new_sub_contractor: null,
    affecting_other_contractors: null,
    other_conditions: null,
    lighting_begin_work: null,
    specific_risks: null,
    environment_ensured: null,
    course_of_action: null,
    working_on_electrical_system: null,
    responsible_for_the_informed: null,
    de_energized: null,
    if_no_loto: null,
    do_risk_assessment: null,
    if_yes_loto: null,
    electricity_have_isulation: null,
    electrician_certification: null,
    working_hazardious_substen: null,
    relevant_mal: null,
    msds: null,
    ventilation: null,
    equipment_taken_account: null,
    hazardaus_substances: null,
    storage_and_disposal: null,
    reachable_case: null,
    checical_risk_assessment: null,
    pressure_tesing_of_equipment: null,
    transfer_of_palnt: null,
    area_drained: null,
    area_depressurised: null,
    area_flused: null,
    tank_area_container: null,
    system_free_for_dust: null,
    loto_plan_submitted: null,
    working_at_height: null,
    segragated_demarkated: null,
    lanyard_attachments: null,
    rescue_plan: null,
    avoid_hazards: null,
    height_training: null,
    supervision: null,
    shock_absorbing: null,
    vertical_life: null,
    height_equipments: null,
    secured_falling: null,
    dropped_objects: null,
    safe_acces: null,
    weather_acceptable: null,
    working_confined_spaces: null,
    vapours_gases: null,
    lel_measurement: null,
    all_equipment: null,
    exit_conditions: null,
    communication_emergency: null,
    rescue_equipments: null,
    space_ventilation: null,
    oxygen_meter: null,
    work_in_atex_area: null,
    ex_area_downgraded: null,
    atmospheric_tester: null,
    flammable_materials: null,
    potential_explosive: null,
    oxygen_meter_confined_spaces: null,
    securing_facilities: null,
    loto_facilities: null,
    system_depressurised: null,
    passive_pause_other: null,
    covered_or_secured: null,
    excavation_works: null,
    excavation_segregated: null,
    nn_standards: null,
    danish_regulation: null,
    safe_access_and_egress: null,
    correctly_sloped: null,
    inspection_dates: null,
    marked_drawings: null,
    underground_areas_cleared: null,
    using_cranes_or_lifting: null,
    appointed_person: null,
    vendor_supplier: null,
    lift_plan: null,
    supplied_and_inspected: null,
    legal_required_certificates: null,
    prapared_lifting: null,
    lifting_task_fenced: null,
    overhead_risks: null,
    visible_clothing: null,
    safety_shoes: null,
    helmet: null,
    rams_file: null,
    description_of_activity: null,
    specific_gloves: null,
    eye_protection: null,
    fall_protection: null,
    hearing_protection: null,
    respiratory_protection: null,
    other_ppe: null,
    other_conditions_input: null,
    people_electrician_certification: null,
    electricity_have_insulation: null,

    ConM_initials: null,
    reject_reason: null,
    ConM_initials1: null,
    cancel_reason: null,
    name_of_the_fire_watcher1: null,
    phone_number_of_fire_watcher1: null,
    denmark_time: null,

    system_drained: null,
    excavation_shoring: null,
    rams_number: null,
    night_shift: null,
    new_date: null,
    new_end_time: null
  };
  images: any[] = [];
  base64Images: any[] = [];

  images1: any[] = [];
  base64Images1: any[] = [];

  Close_Request: UpdateClose_Status = {
    id: null,
    Image: [],
    Request_status: null,
    userId: null,
    createdTime: null,
    denmark_time: null,
    h_heat_source: null,
    h_workplace_check: null,
    h_fire_detectors: null,
    h_start_time: null,
    h_end_time: null,
    close_note: null,
  };
  userdata: any = {};

  type: string = "";
  croppedImage: string = "";
  isclose: boolean = false;
  isimguploaded: boolean = false;
  isimguploaded1: boolean = false;
  spinner: boolean = false;
  CurrenttimeNow: string;
  requestDatas: any;
  statusUpdateForm: FormGroup;
  statusApprovedForm: FormGroup;
  statusOpenForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestdataservice: RequestService,
    private _snackBar: MatSnackBar,
    private authservice: JwtAuthService
  ) {
    this.userdata = this.authservice.getUser();

    this.statusUpdateForm = new FormGroup({
      h_heat_source: new FormControl('', Validators.required),
      h_workplace_check: new FormControl('', Validators.required),
      h_fire_detectors: new FormControl('', Validators.required),
      h_start_time: new FormControl('', Validators.required),
      h_end_time: new FormControl('', Validators.required),
      close_note: new FormControl('', Validators.required),
    })

    this.statusApprovedForm = new FormGroup({
      ConM_initials: new FormControl('', Validators.required),
      reject_reason: new FormControl('', Validators.required),
    })

    this.statusOpenForm = new FormGroup({
      ConM_initials1: new FormControl('', Validators.required),
      cancel_reason: new FormControl('', Validators.required),
      // name_of_the_fire_watcher1: new FormControl('', Validators.required),
      // phone_number_of_fire_watcher1: new FormControl('', Validators.required),
    })

  }

  ngOnInit(): void {
    console.log("DATA", this.data)
    this.updaterequestdata.userId = this.userdata["id"];
    this.type = this.data["type"];
    this.requestDatas = this.data["payload"]["Request_status"]
    this.updaterequestdata.teamId = this.data["payload"]["teamId"];
    this.updaterequestdata.Activity = this.data["payload"]["Activity"];
    this.updaterequestdata.Assign_Start_Time =
      this.data["payload"]["Assign_Start_Time"];
    this.updaterequestdata.Badge_Numbers =
      this.data["payload"]["Badge_Numbers"];
    this.updaterequestdata.Building_Id = this.data["payload"]["Building_Id"];
    this.updaterequestdata.Certified_Person =
      this.data["payload"]["Certified_Person"];
    this.updaterequestdata.Company_Name = this.data["payload"]["Company_Name"];

    this.updaterequestdata.Crane_Number = this.data["payload"]["Crane_Number"];
    this.updaterequestdata.Crane_Requested =
      this.data["payload"]["Crane_Requested"];
    this.updaterequestdata.End_Time = this.data["payload"]["End_Time"];
    this.updaterequestdata.new_date = this.data["payload"]["new_date"];
    this.updaterequestdata.night_shift = this.data["payload"]["night_shift"];
    this.updaterequestdata.new_end_time = this.data["payload"]["new_end_time"];
    this.updaterequestdata.Floor_Id = this.data["payload"]["Floor_Id"];
    this.updaterequestdata.Foreman = this.data["payload"]["Foreman"];
    this.updaterequestdata.Foreman_Phone_Number =
      this.data["payload"]["Foreman_Phone_Number"];

    this.updaterequestdata.Hot_work = this.data["payload"]["Hot_work"];
    this.updaterequestdata.LOTO_Number = this.data["payload"]["LOTO_Number"];
    this.updaterequestdata.LOTO_Procedure =
      this.data["payload"]["LOTO_Procedure"];
    this.updaterequestdata.Machinery = this.data["payload"]["Machinery"];
    this.updaterequestdata.Notes = this.data["payload"]["Notes"];
    this.updaterequestdata.Number_Of_Workers =
      this.data["payload"]["Number_Of_Workers"];

    this.updaterequestdata.PermitNo = this.data["payload"]["PermitNo"];
    this.updaterequestdata.Power_Off_Required =
      this.data["payload"]["Power_Off_Required"];
    this.updaterequestdata.Request_Date = this.data["payload"]["Request_Date"];
    this.updaterequestdata.Request_status =
      this.data["payload"]["Request_status"];
    this.updaterequestdata.Room_Nos = this.data["payload"]["Room_Nos"];
    this.updaterequestdata.Room_Type = this.data["payload"]["Room_Type"];

    this.updaterequestdata.Safety_Precautions =
      this.data["payload"]["Safety_Precautions"];
    this.updaterequestdata.Site_Id = this.data["payload"]["Site_Id"];
    this.updaterequestdata.Special_Instructions =
      this.data["payload"]["Special_Instructions"];
    this.updaterequestdata.Start_Time = this.data["payload"]["Start_Time"];
    this.updaterequestdata.Sub_Contractor_Id =
      this.data["payload"]["Sub_Contractor_Id"];
    this.updaterequestdata.Tools = this.data["payload"]["Tools"];

    this.updaterequestdata.Type_Of_Activity_Id =
      this.data["payload"]["Type_Of_Activity_Id"];
    this.updaterequestdata.Working_Date = this.data["payload"]["Working_Date"];
    this.updaterequestdata.id = this.data["payload"]["id"];
    this.updaterequestdata.rams_number = this.data["payload"]["rams_number"];


    // new keys added

    this.updaterequestdata.affecting_other_contractors = this.data["payload"]["affecting_other_contractors"];
    this.updaterequestdata.other_conditions = this.data["payload"]["other_conditions"];
    this.updaterequestdata.lighting_begin_work = this.data["payload"]["lighting_begin_work"];
    this.updaterequestdata.specific_risks = this.data["payload"]["specific_risks"];
    this.updaterequestdata.environment_ensured = this.data["payload"]["environment_ensured"];
    this.updaterequestdata.course_of_action = this.data["payload"]["course_of_action"];


    this.updaterequestdata.tasks_in_progress_in_the_area = this.data["payload"]["tasks_in_progress_in_the_area"];
    this.updaterequestdata.lighting_sufficiently = this.data["payload"]["lighting_sufficiently"];
    this.updaterequestdata.spesific_risks_based_on_task = this.data["payload"]["spesific_risks_based_on_task"];
    this.updaterequestdata.work_environment_safety_ensured = this.data["payload"]["work_environment_safety_ensured"];
    this.updaterequestdata.course_of_action_in_emergencies = this.data["payload"]["course_of_action_in_emergencies"];
    this.updaterequestdata.fire_watch_establish = this.data["payload"]["fire_watch_establish"];
    this.updaterequestdata.combustible_material = this.data["payload"]["combustible_material"];
    this.updaterequestdata.safety_measures = this.data["payload"]["safety_measures"];
    this.updaterequestdata.extinguishers_and_fire_blanket = this.data["payload"]["extinguishers_and_fire_blanket"];

    this.updaterequestdata.welding_activitiy = this.data["payload"]["welding_activitiy"];
    this.updaterequestdata.heat_treatment = this.data["payload"]["heat_treatment"];
    this.updaterequestdata.air_extraction_be_established = this.data["payload"]["air_extraction_be_established"];


    // electrical_system
    this.updaterequestdata.working_on_electrical_system = this.data["payload"]["working_on_electrical_system"];
    this.updaterequestdata.responsible_for_the_informed = this.data["payload"]["responsible_for_the_informed"];
    this.updaterequestdata.de_energized = this.data["payload"]["de_energized"];
    this.updaterequestdata.if_no_loto = this.data["payload"]["if_no_loto"];
    this.updaterequestdata.do_risk_assessment = this.data["payload"]["do_risk_assessment"];
    this.updaterequestdata.if_yes_loto = this.data["payload"]["if_yes_loto"];
    this.updaterequestdata.electricity_have_isulation = this.data["payload"]["electricity_have_isulation"];
    this.updaterequestdata.electrician_certification = this.data["payload"]["electrician_certification"];

    // working_hazardious_substen
    this.updaterequestdata.working_hazardious_substen = this.data["payload"]["working_hazardious_substen"];
    this.updaterequestdata.relevant_mal = this.data["payload"]["relevant_mal"];
    this.updaterequestdata.msds = this.data["payload"]["msds"];
    this.updaterequestdata.equipment_taken_account = this.data["payload"]["equipment_taken_account"];
    this.updaterequestdata.ventilation = this.data["payload"]["ventilation"];
    this.updaterequestdata.hazardaus_substances = this.data["payload"]["hazardaus_substances"];
    this.updaterequestdata.storage_and_disposal = this.data["payload"]["storage_and_disposal"];
    this.updaterequestdata.reachable_case = this.data["payload"]["reachable_case"];
    this.updaterequestdata.checical_risk_assessment = this.data["payload"]["checical_risk_assessment"];

    // pressure_tesing_of_equipment
    this.updaterequestdata.pressure_tesing_of_equipment = this.data["payload"]["pressure_tesing_of_equipment"];
    this.updaterequestdata.transfer_of_palnt = this.data["payload"]["transfer_of_palnt"];
    this.updaterequestdata.area_drained = this.data["payload"]["area_drained"];
    this.updaterequestdata.area_depressurised = this.data["payload"]["area_depressurised"];
    this.updaterequestdata.area_flused = this.data["payload"]["area_flused"];
    this.updaterequestdata.tank_area_container = this.data["payload"]["tank_area_container"];
    this.updaterequestdata.system_free_for_dust = this.data["payload"]["system_free_for_dust"];
    this.updaterequestdata.loto_plan_submitted = this.data["payload"]["loto_plan_submitted"];

    // <!-- height start -->
    this.updaterequestdata.working_at_height = this.data["payload"]["working_at_height"];
    this.updaterequestdata.segragated_demarkated = this.data["payload"]["segragated_demarkated"];
    this.updaterequestdata.lanyard_attachments = this.data["payload"]["lanyard_attachments"];
    this.updaterequestdata.rescue_plan = this.data["payload"]["rescue_plan"];
    this.updaterequestdata.avoid_hazards = this.data["payload"]["avoid_hazards"];
    this.updaterequestdata.height_training = this.data["payload"]["height_training"];
    this.updaterequestdata.supervision = this.data["payload"]["supervision"];
    this.updaterequestdata.shock_absorbing = this.data["payload"]["shock_absorbing"];
    this.updaterequestdata.height_equipments = this.data["payload"]["height_equipments"];
    this.updaterequestdata.vertical_life = this.data["payload"]["vertical_life"];
    this.updaterequestdata.secured_falling = this.data["payload"]["secured_falling"];
    this.updaterequestdata.dropped_objects = this.data["payload"]["dropped_objects"];
    this.updaterequestdata.safe_acces = this.data["payload"]["safe_acces"];
    this.updaterequestdata.weather_acceptable = this.data["payload"]["weather_acceptable"];

    // working_confined_spaces
    this.updaterequestdata.working_confined_spaces = this.data["payload"]["working_confined_spaces"];
    this.updaterequestdata.vapours_gases = this.data["payload"]["vapours_gases"];
    this.updaterequestdata.lel_measurement = this.data["payload"]["lel_measurement"];
    this.updaterequestdata.all_equipment = this.data["payload"]["all_equipment"];
    this.updaterequestdata.exit_conditions = this.data["payload"]["exit_conditions"];
    this.updaterequestdata.communication_emergency = this.data["payload"]["communication_emergency"];
    this.updaterequestdata.rescue_equipments = this.data["payload"]["rescue_equipments"];
    this.updaterequestdata.space_ventilation = this.data["payload"]["space_ventilation"];
    this.updaterequestdata.oxygen_meter = this.data["payload"]["oxygen_meter"];

    // work_in_atex_area

    this.updaterequestdata.work_in_atex_area = this.data["payload"]["work_in_atex_area"];
    this.updaterequestdata.ex_area_downgraded = this.data["payload"]["ex_area_downgraded"];
    this.updaterequestdata.atmospheric_tester = this.data["payload"]["atmospheric_tester"];
    this.updaterequestdata.flammable_materials = this.data["payload"]["flammable_materials"];
    this.updaterequestdata.potential_explosive = this.data["payload"]["potential_explosive"];
    this.updaterequestdata.oxygen_meter_confined_spaces = this.data["payload"]["oxygen_meter_confined_spaces"];

    // <!-- FACILITIES LOTO start -->
    this.updaterequestdata.securing_facilities = this.data["payload"]["securing_facilities"];
    this.updaterequestdata.loto_facilities = this.data["payload"]["loto_facilities"];
    this.updaterequestdata.system_depressurised = this.data["payload"]["system_depressurised"];
    this.updaterequestdata.system_drained = this.data["payload"]["system_drained"];
    this.updaterequestdata.passive_pause_other = this.data["payload"]["passive_pause_other"];
    this.updaterequestdata.electricity_have_insulation = this.data["payload"]["electricity_have_insulation"];
    this.updaterequestdata.covered_or_secured = this.data["payload"]["covered_or_secured"];
    this.updaterequestdata.people_electrician_certification = this.data["payload"]["people_electrician_certification"];

    // excavation_works
    this.updaterequestdata.excavation_works = this.data["payload"]["excavation_works"];
    this.updaterequestdata.excavation_segregated = this.data["payload"]["excavation_segregated"];
    this.updaterequestdata.nn_standards = this.data["payload"]["nn_standards"];
    this.updaterequestdata.excavation_shoring = this.data["payload"]["excavation_shoring"];
    this.updaterequestdata.danish_regulation = this.data["payload"]["danish_regulation"];
    this.updaterequestdata.safe_access_and_egress = this.data["payload"]["safe_access_and_egress"];
    this.updaterequestdata.correctly_sloped = this.data["payload"]["correctly_sloped"];
    this.updaterequestdata.inspection_dates = this.data["payload"]["inspection_dates"];
    this.updaterequestdata.marked_drawings = this.data["payload"]["marked_drawings"];
    this.updaterequestdata.underground_areas_cleared = this.data["payload"]["underground_areas_cleared"];

    // using_cranes_or_lifting

    this.updaterequestdata.using_cranes_or_lifting = this.data["payload"]["using_cranes_or_lifting"];
    this.updaterequestdata.appointed_person = this.data["payload"]["appointed_person"];
    this.updaterequestdata.vendor_supplier = this.data["payload"]["vendor_supplier"];
    this.updaterequestdata.lift_plan = this.data["payload"]["lift_plan"];
    this.updaterequestdata.supplied_and_inspected = this.data["payload"]["supplied_and_inspected"];
    this.updaterequestdata.legal_required_certificates = this.data["payload"]["legal_required_certificates"];
    this.updaterequestdata.prapared_lifting = this.data["payload"]["prapared_lifting"];
    this.updaterequestdata.lifting_task_fenced = this.data["payload"]["lifting_task_fenced"];
    this.updaterequestdata.overhead_risks = this.data["payload"]["overhead_risks"];

    this.updaterequestdata.new_sub_contractor = this.data["payload"]["new_sub_contractor"];
    this.updaterequestdata.description_of_activity = this.data["payload"]["description_of_activity"];
    this.updaterequestdata.specific_gloves = this.data["payload"]["specific_gloves"];
    this.updaterequestdata.eye_protection = this.data["payload"]["eye_protection"];
    this.updaterequestdata.fall_protection = this.data["payload"]["fall_protection"];
    this.updaterequestdata.hearing_protection = this.data["payload"]["hearing_protection"];
    this.updaterequestdata.respiratory_protection = this.data["payload"]["respiratory_protection"];
    this.updaterequestdata.other_ppe = this.data["payload"]["other_ppe"];
    this.updaterequestdata.other_conditions_input = this.data["payload"]["other_conditions_input"];
    this.updaterequestdata.rams_file = this.data["payload"]["rams_file"];

    // new add data
    this.updaterequestdata.ConM_initials = this.data["payload"]["ConM_initials"];
    this.updaterequestdata.reject_reason = this.data["payload"]["reject_reason"];

    this.Close_Request.h_heat_source = this.data["payload"]["h_heat_source"];
    this.Close_Request.h_workplace_check = this.data["payload"]["ConM_initials"];
    this.Close_Request.h_fire_detectors = this.data["payload"]["ConM_initials"];
    this.Close_Request.h_start_time = this.data["payload"]["ConM_initials"];
    this.Close_Request.h_end_time = this.data["payload"]["ConM_initials"];
    this.Close_Request.close_note = this.data["payload"]["close_note"];


    // this.updaterequestdata.denmark_time = this.data["payload"]["denmark_time"];
    // if (this.updaterequestdata.Hot_work == 1) {
    //   this.statusOpenForm.get('name_of_the_fire_watcher1').setValidators([Validators.required]);
    //   this.statusOpenForm.get('phone_number_of_fire_watcher1').setValidators([Validators.required]);
    // } else {
    //   this.statusOpenForm.get('name_of_the_fire_watcher1').clearValidators();
    //   this.statusOpenForm.get('phone_number_of_fire_watcher1').clearValidators();
    // }

    // if(this.type=='Closed' && this.updaterequestdata.Hot_work !== 1){
    //   this.statusUpdateForm.get('h_heat_source').clearValidators();
    //   this.statusUpdateForm.get('h_workplace_check').clearValidators();
    //   this.statusUpdateForm.get('h_fire_detectors').clearValidators();
    //   this.statusUpdateForm.get('h_start_time').clearValidators();
    //   this.statusUpdateForm.get('h_end_time').clearValidators();
    // }
  }

  Changestatus(statusdata) {
    (Object as any).keys(this.statusApprovedForm.controls).forEach((control) => {
      this.statusApprovedForm.get(`${control}`).markAsTouched();
    });
    (Object as any).keys(this.statusOpenForm.controls).forEach((control) => {
      this.statusOpenForm.get(`${control}`).markAsTouched();
    });
    console.log(statusdata, 'data')
    var today = moment.tz("Europe/Copenhagen");
    this.CurrenttimeNow = today.format('HH:mm:ss');
  
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);
    if (statusdata == "Closed") {
      this.isclose = true;
    } else {
      this.isclose = false;
      console.log(config.Denmarktz.split(" "));
      const [currentDenmarkDate, currentDenmarkTime] = [
        ...config.Denmarktz.split(" "),
      ];

      // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime];
     
      this.updaterequestdata.Request_status = statusdata;
      // this.updaterequestdata.createdTime = this.CurrenttimeNow;

      this.updaterequestdata.createdTime = [currentDenmarkDate, currentDenmarkTime];


      // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime] ;

      // console.log(this.updaterequestdata, "test data");

      // console.log(this.updaterequestdata,"stats");

      if (this.statusApprovedForm.get('ConM_initials').valid) {
        this.updaterequestdata.ConM_initials = this.statusApprovedForm.value.ConM_initials;
      }
      if(this.statusApprovedForm.get('reject_reason').valid) {
        this.updaterequestdata.reject_reason = this.statusApprovedForm.value.reject_reason;
      }
      // if (this.statusOpenForm.valid) {
      //   this.updaterequestdata.ConM_initials1 = this.statusOpenForm.value.ConM_initials1;
      //   this.updaterequestdata.name_of_the_fire_watcher1 = this.statusOpenForm.value.name_of_the_fire_watcher1;
      //   this.updaterequestdata.phone_number_of_fire_watcher1 = this.statusOpenForm.value.phone_number_of_fire_watcher1;
      //   formData.append('file', this.fileInput.files[0]);
      // }
      let formData = new FormData();
      if (this.images1.length > 0) {
        for (var i = 0; i < this.images1.length; i++) {
          formData.append("Image1", this.images1[i]);
        }
      }
      for (const [key, value] of Object.entries(this.updaterequestdata)) {
        formData.append(key, value); // Ensure values are strings if needed
      }

      this.requestdataservice.UpdateRequest(formData as unknown as EditRequestDto).subscribe(
        (x) => {
          if (x.status == 200) {
            this.openSnackBar("Request Status Updated Successfully");
            // console.log("TEST", this.data.pagedatainfo.Start, this.data.pagedatainfo.Page)
            window.location.reload();
            this.ngOnInit();
          }
        },
        (error) => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }

      );

    }
  }

  startTime() {

  }

  ChangestatusToOpen(statusdata){
    (Object as any).keys(this.statusApprovedForm.controls).forEach((control) => {
      this.statusApprovedForm.get(`${control}`).markAsTouched();
    });
    (Object as any).keys(this.statusOpenForm.controls).forEach((control) => {
      this.statusOpenForm.get(`${control}`).markAsTouched();
    });
    console.log(statusdata, 'data')
    var today = moment.tz("Europe/Copenhagen");
    this.CurrenttimeNow = today.format('HH:mm:ss');
  
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);
    if (statusdata == "Closed") {
      this.isclose = true;
    } else {
      this.isclose = false;
      console.log(config.Denmarktz.split(" "));
      const [currentDenmarkDate, currentDenmarkTime] = [
        ...config.Denmarktz.split(" "),
      ];

      // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime];
     
      this.updaterequestdata.Request_status = statusdata;
      // this.updaterequestdata.createdTime = this.CurrenttimeNow;

      this.updaterequestdata.createdTime = [currentDenmarkDate, currentDenmarkTime];


      // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime] ;

      // console.log(this.updaterequestdata, "test data");

      // console.log(this.updaterequestdata,"stats");

   
      if (this.statusOpenForm.get('ConM_initials1').valid) {
        this.updaterequestdata.ConM_initials1 = this.statusOpenForm.value.ConM_initials1;
        // this.updaterequestdata.name_of_the_fire_watcher1 = this.statusOpenForm.value.name_of_the_fire_watcher1;
        // this.updaterequestdata.phone_number_of_fire_watcher1 = this.statusOpenForm.value.phone_number_of_fire_watcher1;
        // formData.append('file', this.fileInput.files[0]);
      }
      if (this.statusOpenForm.get('cancel_reason').valid) {
        this.updaterequestdata.cancel_reason = this.statusOpenForm.value.cancel_reason;
      }
      let formData = new FormData();
      if (this.images1.length > 0) {
        for (var i = 0; i < this.images1.length; i++) {
          formData.append("Image1", this.images1[i]);
        }
      }
      for (const [key, value] of Object.entries(this.updaterequestdata)) {
        formData.append(key, value); // Ensure values are strings if needed
      }

      this.requestdataservice.UpdateRequest(formData as unknown as EditRequestDto).subscribe(
        (x) => {
          if (x.status == 200) {
            this.openSnackBar("Request Status Updated Successfully");
            // console.log("TEST", this.data.pagedatainfo.Start, this.data.pagedatainfo.Page)
            window.location.reload();
            this.ngOnInit();
          }
        },
        (error) => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }

      );

    }
  }


  Changestatusbysubcontractor(status) {
    var today = moment.tz("Europe/Copenhagen");
    this.CurrenttimeNow = today.format('HH:mm:ss');
    console.log("Time now", this.CurrenttimeNow)
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);
    console.log(config.Denmarktz.split(" "));
    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(" "),
    ];
    console.log(currentDenmarkTime);
    console.log(currentDenmarkDate);
    const formData = new FormData();
    this.spinner = true;
    this.Close_Request.id = this.updaterequestdata.id;
    this.Close_Request.Request_status = status;
    // this.Close_Request.createdTime = this.CurrenttimeNow;
    this.Close_Request.createdTime = [currentDenmarkDate, currentDenmarkTime];
    // this.Close_Request.denmark_time = [currentDenmarkDate, currentDenmarkTime];

    // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime] ;
    
    if (this.images.length > 0) {
      for (var i = 0; i < this.images.length; i++) {
        formData.append("Image[]", this.images[i]);
      }
    }
    
    // this.Close_Request.Image =  formData;
    //  const formData = new FormData();
    formData.append("id", this.Close_Request.id);
    formData.append("Request_status", this.Close_Request.Request_status);
    formData.append("userId", this.userdata["id"]);
    formData.append("createdTime", this.Close_Request.createdTime);
    
    if (this.statusUpdateForm.valid && this.updaterequestdata.Hot_work == 1) {
      formData.append("h_heat_source", this.statusUpdateForm.value.h_heat_source);
      formData.append("h_workplace_check", this.statusUpdateForm.value.h_workplace_check);
      formData.append("h_fire_detectors", this.statusUpdateForm.value.h_fire_detectors);
      formData.append("h_start_time", this.statusUpdateForm.value.h_start_time);
      formData.append("h_end_time", this.statusUpdateForm.value.h_end_time);
    }

    console.log(this.statusUpdateForm, "form")

    this.requestdataservice.CloseRequest(formData).subscribe(
      (res) => {
        if (res.status == 200) {
          this.openSnackBar("Request Status Updated Successfully");
          this.spinner = false;
          window.location.reload();
          this.ngOnInit();
        }
      },
      (error) => {
        this.spinner = false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  Changestatusbysubcontractor1(status) {
    var today = moment.tz("Europe/Copenhagen");
    this.CurrenttimeNow = today.format('HH:mm:ss');
    console.log("Time now", this.CurrenttimeNow)
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);
    console.log(config.Denmarktz.split(" "));
    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(" "),
    ];
    console.log(currentDenmarkTime);
    console.log(currentDenmarkDate);
    const formData = new FormData();
    this.spinner = true;
    this.Close_Request.id = this.updaterequestdata.id;
    this.Close_Request.Request_status = status;
    // this.Close_Request.createdTime = this.CurrenttimeNow;
    this.Close_Request.createdTime = [currentDenmarkDate, currentDenmarkTime];
    // this.Close_Request.denmark_time = [currentDenmarkDate, currentDenmarkTime];

    // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime] ;
    
    if (this.images.length > 0) {
      for (var i = 0; i < this.images.length; i++) {
        formData.append("Image[]", this.images[i]);
      }
    }
    
    // this.Close_Request.Image =  formData;
    //  const formData = new FormData();
    formData.append("id", this.Close_Request.id);
    formData.append("Request_status", this.Close_Request.Request_status);
    formData.append("userId", this.userdata["id"]);
    formData.append("createdTime", this.Close_Request.createdTime);
    formData.append("close_note", this.statusUpdateForm.value.close_note);
    
    if (this.statusUpdateForm.valid && this.updaterequestdata.Hot_work == 1) {
      formData.append("h_heat_source", this.statusUpdateForm.value.h_heat_source);
      formData.append("h_workplace_check", this.statusUpdateForm.value.h_workplace_check);
      formData.append("h_fire_detectors", this.statusUpdateForm.value.h_fire_detectors);
      formData.append("h_start_time", this.statusUpdateForm.value.h_start_time);
      formData.append("h_end_time", this.statusUpdateForm.value.h_end_time);
    }

    console.log(this.statusUpdateForm, "form")

    this.requestdataservice.CloseRequest(formData).subscribe(
      (res) => {
        if (res.status == 200) {
          this.openSnackBar("Request Status Updated Successfully");
          this.spinner = false;
          window.location.reload();
          this.ngOnInit();
        }
      },
      (error) => {
        this.spinner = false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }



  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }

  csvInputChange(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.images.push(e.target.files[i]);
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(e.target.files[i]);
      this.isimguploaded = true;
    }
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.base64Images.push(reader.result);
  }

  csvInputChange1(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.images1.push(e.target.files[i]);
      var reader = new FileReader();

      reader.onload = this._handleReaderLoadeds.bind(this);
      reader.readAsDataURL(e.target.files[i]);
      this.isimguploaded1 = true;
    }
  }
  _handleReaderLoadeds(e) {
    let reader = e.target;
    this.base64Images1.push(reader.result);
  }
}
