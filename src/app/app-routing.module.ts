import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* COMPONENTES */
import { RegistroComponent } from './Component/registro/registro.component';
import { Error404Component } from './Component/error404/error404.component'
import { LoginComponent } from './Component/login/login.component';

import { InicioComponent } from './Component/inicio/inicio.component';
import { InterPostComponent } from './Component/inter-post/inter-post.component';
import { ConfirmacionComponent } from './Component/confirmacion/confirmacion.component';
import { GuardCanActivateService } from './Services/guard-can-activate.service';
import { ListarPostsComponent } from './Component/listar-posts/listar-posts.component';
import { ConfirmacionMovilComponent } from './Component/confirmacion-movil/confirmacion-movil.component';
import { GuardBlackCanActivateServiceService } from './Services/guard-black-can-activate-service.service';





const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'login', component:LoginComponent},
    {path:'confirmacion', component:ConfirmacionComponent},
    {path:'registro', component:RegistroComponent},
    {path:'confirmacion/celular', component:ConfirmacionMovilComponent, canActivate: [GuardBlackCanActivateServiceService]},
    {path:'inicio', component:InicioComponent,  canActivate: [GuardCanActivateService]},
    {path:'posts', component:InterPostComponent, canActivate: [GuardCanActivateService]  },
    {path:'listar/posts', component:ListarPostsComponent, canActivate: [GuardCanActivateService]  },
    {path:'**',component:Error404Component}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
