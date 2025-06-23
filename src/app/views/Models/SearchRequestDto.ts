export class SearchRequestDto
{
    Site_Id:string;
    Building_Id:string;
    Sub_Contractor_Id:string;
    fromDate:string;
    toDate:string;
    Type_Of_Activity_Id:string;
    Request_status:string;
    PermitNo:string;
    Activity:string;
    Room_Type: string;
    Start: string;
    End: string;
    Page: string;
    hras: string;
    taskSpecificPPE: string;
    area: string;
}

export class ListRequest
{
    Permit_Number:string;
    Activity:string;
    Sub_contractor:string;
    Working_Date:string;
    Time:string;
    Status:string;
    Operations:string; 
    Room_Type: string;
    Start: string;
    End: string;
    Page: string;
}