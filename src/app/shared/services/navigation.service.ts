// import { Injectable } from "@angular/core";
// import { BehaviorSubject } from "rxjs";

// interface IMenuItem {
//   type: string; // Possible values: link/dropDown/icon/separator/extLink
//   name?: string; // Used as display text for item and title for separator type
//   state?: string; // Router state
//   icon?: string; // Material icon name
//   tooltip?: string; // Tooltip text
//   disabled?: boolean; // If true, item will not be appeared in sidenav.
//   sub?: IChildItem[]; // Dropdown items
//   badges?: IBadge[];
// }
// interface IChildItem {
//   type?: string;
//   name: string; // Display text
//   state?: string; // Router state
//   icon?: string;
//   sub?: IChildItem[];
// }

// interface IBadge {
//   color: string; // primary/accent/warn/hex color codes(#fff000)
//   value: string; // Display text
// }

// @Injectable()
// export class NavigationService {
//   constructor() {}
  

//   plainMenu: IMenuItem[] = [
//     {
//       name: "OTHERS",
//       type: "link",
//       tooltip: "Others",
//       icon: "blur_on",
//       state: "others/blank",
//     },
//     {
//       name: "DOC",
//       type: "extLink",
//       tooltip: "Documentation",
//       icon: "library_books",
//       state: "http://demos.ui-lib.com/egret-doc/"
//     }
//   ];

//   // Icon menu TITLE at the very top of navigation.
//   // This title will appear if any icon type item is present in menu.
//   iconTypeMenuTitle: string = "Frequently Accessed";
//   // sets iconMenu as default;
//   menuItems = new BehaviorSubject<IMenuItem[]>(this.plainMenu);
//   // navigation component has subscribed to this Observable
//   menuItems$ = this.menuItems.asObservable();

  
//   // you can customize this method to supply different menu for
//   // different user type.
//   publishNavigationChange(menuType: string) {
//     this.menuItems.next(this.plainMenu);
//   }
// }


import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JwtAuthService } from "./auth/jwt-auth.service";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  menuItems:any={};
  iconMenu: IMenuItem[] = [
    // {
    //   name: "HOME",
    //   type: "icon",
    //   tooltip: "Home",
    //   icon: "home",
    //   state: "home"
    // },
    // {
    //   name: "PROFILE",
    //   type: "icon",
    //   tooltip: "Profile",
    //   icon: "person",
    //   state: "profile/overview"
    // },
    // {
    //   name: "TOUR",
    //   type: "icon",
    //   tooltip: "Tour",
    //   icon: "flight_takeoff",
    //   state: "tour"
    // },
    // {
    //   type: "separator",
    //   name: "Main Items"
    // },
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard", 
      state: "user/dashboard",
      // sub: [
      //   { name: "Default", state: "default" },
      //   { name: "Analytics", state: "analytics" },
      //   { name: "Cryptocurrency", state: "crypto" },
      //   { name: "Dark Cards", state: "dark" }
      // ]
    },
    
    {
      name: "Departments",
      type: "dropDown",
      tooltip: "Departments",
      icon: "event", 
      state: "",
      sub: [
        { name: "New Department", state: "admin/department" ,icon: "fa fa-plus-square"},
        { name: "List Departments", state: "admin/listdepartment", icon: "list" }
      ]
    },
    {
      name: "subcontractors",
      type: "dropDown",
      tooltip: "subcontractors",
      icon: "event", 
      state: "",
      sub: [
        { name: "Sub Contractors", state: "admin/sub-contractors", icon: "fa fa-plus-square"},
        { name: "Sub Contractors List", state: "admin/subcontractors-list", icon: "fa fa-plus-square"},
      ]
    },
    {
      name: "Employees",
      type: "dropDown",
      tooltip: "Employees",
      icon: "event", 
      state: "",
      sub: [
        { name: "New Employee", state: "admin/employee" ,icon: "fa fa-plus-square"},
        { name: "List Employees", state: "admin/listemployee", icon: "list" }
      ]
    },
    {
      name: "Teams",
      type: "dropDown",
      tooltip: "Team",
      icon: "event", 
      state: "",
      sub: [
        { name: "Team", state: "admin/Team", icon: "fa fa-plus-square"},
        { name: "List Teams", state: "admin/list-team", icon: "list" }
       
      ]
    },
    {
      name: "Request",
      type: "dropDown",
      tooltip: "Request",
      icon: "person", 
      state: "",
      sub: [
        { name: "New Request", state: "user/new-request" ,icon: "fa fa-plus-square"},
        { name: "List Request", state: "user/list-request", icon: "list" }
      ]
    },

        {
      name: "Reports",
      type: "link",
      tooltip: "Reports",
      icon: "event", 
      state: "user/plans"
    },

    // {
    //   name: "Plans",
    //   type: "dropDown",
    //   tooltip: "Plans",
    //   icon: "event", 
    //   state: "",
    //   sub: [
    //     { name: "New Plan", state: "user/plans" ,icon: "fa fa-plus-square"},
    //     { name: "List Plan", state: "user/list-plans", icon: "list" }
    //   ]
    // },

   
    {
      name: "Notifications",
      type: "link",
      tooltip: "Notifications",
      icon: "notifications", 
      state: "user/notifications"
    },
  ];

  AdminiconMenu: IMenuItem[] = [
  
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard", 
      state: "user/dashboard",
    },
    
    {
      name: "Departments",
      type: "dropDown",
      tooltip: "Departments",
      icon: "event", 
      state: "",
      sub: [
        { name: "New Department", state: "admin/department" ,icon: "fa fa-plus-square"},
        { name: "List Departments", state: "admin/listdepartment", icon: "list" }
      ]
    },
    {
      name: "Contractors",
      type: "dropDown",
      tooltip: "Contractors",
      icon: "event", 
      state: "",
      sub: [
        { name: "Contractors", state: "admin/sub-contractors", icon: "fa fa-plus-square"},
        { name: "Contractors List", state: "admin/subcontractors-list", icon: "fa fa-plus-square"},
      ]
    },
    {
      name: "Employees",
      type: "dropDown",
      tooltip: "Employees",
      icon: "event", 
      state: "",
      sub: [
        { name: "New Employee", state: "admin/employee" ,icon: "fa fa-plus-square"},
        { name: "List Employees", state: "admin/listemployee", icon: "list" }
      ]
    },
    // {
    //   name: "Teams",
    //   type: "dropDown",
    //   tooltip: "Team",
    //   icon: "event", 
    //   state: "",
    //   sub: [
    //     { name: "Team", state: "admin/Team", icon: "fa fa-plus-square"},
    //     { name: "List Teams", state: "admin/list-team", icon: "list" }
       
    //   ]
    // },
    {
      name: "Request",
      type: "dropDown",
      tooltip: "Request",
      icon: "person", 
      state: "",
      sub: [
        { name: "New Request", state: "user/new-request" ,icon: "fa fa-plus-square"},
        { name: "List Request", state: "user/list-request", icon: "list" }
      ]
    },
    // {
    //   name: "Issues",
    //   type: "dropDown",
    //   tooltip: "Issues",
    //   icon: "person", 
    //   state: "",
    //   sub: [
    //     { name: "New issue", state: "admin/new-issue" ,icon: "fa fa-plus-square"},
    //   ]
    // },
   

        {
      name: "Reports",
      type: "link",
      tooltip: "Reports",
      icon: "event", 
      state: "user/plans"
    },
   
    // {
    //   name: "Docs",
    //   type: "link",
    //   tooltip: "Mydocs",
    //   icon: "notifications", 
    //   state: "user/mydocs"
    // },
    {
      name: "Settings",
      type: "dropDown",
      tooltip: "Settings",
      icon: "person", 
      state: "",
      sub: [

        {
          name: "Activity",
          type: "dropDown",
          icon: "person", 
          state: "",
          sub:[
            { name: "New Activity", state: "admin/activity" ,icon: "fa fa-plus-square"},
            { name: "List Activity", state: "admin/activity-list", icon: "list" }
          ]
        },

        {
          name: "Safety Precaution",
          type: "dropDown",
          icon: "person", 
          state: "",
          sub:[
            { name: "New Precaution", state: "admin/safety-precaution" ,icon: "fa fa-plus-square"},
            { name: "List Precaution", state: "admin/safety-precautions-list", icon: "list" }
          ]
        },
      ]
    },

    {
      name: "Notifications",
      type: "link",
      tooltip: "Notifications",
      icon: "notifications", 
      state: "user/notifications"
    },
    {
      name: "Logs-Histoy",
      type: "link",
      tooltip: "Notifications",
      icon: "notifications", 
      state: "user/log-history"
    },

  ];
  UsericonMenu: IMenuItem[] = [
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard", 
      state: "user/dashboard",
      
    },
  
    {
      name: "Request",
      type: "dropDown",
      tooltip: "Request",
      icon: "person", 
      state: "",
      sub: [
        { name: "New Request", state: "user/new-request" ,icon: "fa fa-plus-square"},
        { name: "List Request", state: "user/list-request", icon: "list" }
      ]
    },

    {
      name: "Notifications",
      type: "link",
      tooltip: "Notifications",
      icon: "notifications", 
      state: "user/notifications"
    },
  ];

  OperatoriconMenu: IMenuItem[] = [

    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard", 
      state: "user/dashboard",
    },
    
    {
      name: "Request",
      type: "dropDown",
      tooltip: "Request",
      icon: "person", 
      state: "",
      sub: [
        { name: "New Request", state: "user/new-request" ,icon: "fa fa-plus-square"},
        { name: "List Request", state: "user/list-request", icon: "list" }
      ]
    },
    // {
    //   name: "Docs",
    //   type: "link",
    //   tooltip: "Mydocs",
    //   icon: "notifications", 
    //   state: "user/mydocs"
    // },
    {
      name: "Reports",
      type: "link",
      tooltip: "Reports",
      icon: "event", 
      state: "user/plans"
    },
    {
      name: "Notifications",
      type: "link",
      tooltip: "Notifications",
      icon: "notifications", 
      state: "user/notifications"
    },
  ];


  ObservericonMenu: IMenuItem[] = [
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard", 
      state: "user/dashboard",
      
    },
  
    {
      name: "Request",
      type: "dropDown",
      tooltip: "Request",
      icon: "person", 
      state: "",
      sub: [
        { name: "List Request", state: "user/list-request", icon: "list" }
      ]
    },
  ];

user:any={};
menuItems$:any={};
  constructor( public jwtAuth: JwtAuthService) {
    this.user=this.jwtAuth.getUser();
    
    if(this.user["role"]=="Subcontractor")
    {
      this.menuItems = new BehaviorSubject<IMenuItem[]>(this.UsericonMenu);
      this.menuItems$ = this.menuItems.asObservable();
    }
    else  if(this.user["role"]=="Admin")
    {
      this.menuItems = new BehaviorSubject<IMenuItem[]>(this.AdminiconMenu);
      this.menuItems$ = this.menuItems.asObservable();

    }
    else  if(this.user["role"]=="Department")
    {
      this.menuItems = new BehaviorSubject<IMenuItem[]>(this.OperatoriconMenu);
      this.menuItems$ = this.menuItems.asObservable();
    }
    else  if(this.user["role"]=="Observer")
    {
      this.menuItems = new BehaviorSubject<IMenuItem[]>(this.ObservericonMenu);
      this.menuItems$ = this.menuItems.asObservable();

    }
    

  }


  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  // navigation component has subscribed to this Observable
  

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
       // this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
       // this.menuItems.next(this.plainMenu);
    }
  }
}

