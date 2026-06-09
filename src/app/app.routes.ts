import { Routes } from '@angular/router';

import { Login } from './login/login';
import { AddEmployee } from './add-employee/add-employee';
import { EditEmployee } from './edit-employee/edit-employee';
import { EmployeeProfile } from './employee-profile/employee-profile';
import { Analytics } from './analytics/analytics';
import { Frontpage } from './frontpage/frontpage';
import { Register } from './register/register';
import { SuperAdmin } from './super-admin/super-admin';
import { UserView } from './user-view/user-view';
import { About } from './about/about';


export const routes: Routes = [

    {
        path: 'super-admin',
        component: SuperAdmin
    },

    {
        path: 'frontpage',
        component: Frontpage
    },

    {
        path: 'register',
        component: Register
    },

    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Frontpage
    },

    

    {
        path: 'add-employee',
        component: AddEmployee
    },

    {
        path: 'edit-employee',
        component: EditEmployee
    },

    { 
        path: 'employee-profile/:id',
        component: EmployeeProfile 
    },

    {
        path: 'employee-profile',
        component: EmployeeProfile
    },

    {
    path: 'edit-employee/:id',
    component: EditEmployee
    },
{
  path: 'edit-employee',
  component: EditEmployee
},

    {
        path: 'analytics',
        component: Analytics
    },

     { 
        path: 'user-view',
        component: UserView },

    {
         path: 'about',
        component: About
     },

];