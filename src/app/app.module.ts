/* MODULOS */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CookieService } from "ngx-cookie-service";
import { TokenService } from './Interceptores/token.service';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/* COMPONENTES */
import { AppComponent } from './app.component';
import { NavBarComponent } from './Component/nav-bar/nav-bar.component';
import { RegistroComponent } from './Component/registro/registro.component';
import { Error404Component } from './Component/error404/error404.component';

import { LoginComponent } from './Component/login/login.component';

import { InicioComponent } from './Component/inicio/inicio.component';
import { CardPostComponent } from './Component/card-post/card-post.component';
import { InterPostComponent } from './Component/inter-post/inter-post.component';
import { ConfirmacionComponent } from './Component/confirmacion/confirmacion.component';
import { ListarPostsComponent } from './Component/listar-posts/listar-posts.component';
import { ConfirmacionMovilComponent } from './Component/confirmacion-movil/confirmacion-movil.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegistroComponent,
    Error404Component,
    LoginComponent,
    InicioComponent,
    CardPostComponent,
    InterPostComponent,
    ConfirmacionComponent,
    ListarPostsComponent,
    ConfirmacionMovilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxSpinnerModule

  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
