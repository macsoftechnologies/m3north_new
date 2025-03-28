export class ActivityDto
{
    activityName:string;
}

export class UpdateActivityDto
{
    id:string;
    activityName:string;
}

export class DeleteActivityDto
{
    id:string;
}
export class DeleteMultiActivityDto
{
    ids:[];
}