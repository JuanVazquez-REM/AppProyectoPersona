import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2'
//import  {  SocketIoModule ,  SocketIoConfig  }  from  'ngx-socket-io' ;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit,OnDestroy {
  request: Object
  loginForm:FormGroup; 
  public url:String;
  
  constructor(private check: CheckTokenService,private api: ServiciosService,private fb:FormBuilder,public router: Router,private cookies: CookieService) {
    this.logForm();
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    console.log(environment.wsURL)
  }
  
  setRequest() {
    this.request = {
      email:this.loginForm.get('email').value,
      password:this.loginForm.get('password').value
    };
  }

  logForm(): void {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  login() {
    this.setRequest()
    this.api.login(this.request).subscribe(async data => {
      console.log(data.ip)
      if(data.status){
        switch(data.rol){
          case "white":
            this.api.setToken(data.token.token)
            this.check.checkToken()
            Swal.fire({
              title: 'Hola!',
              text: '',
              imageUrl: 'https://i.ibb.co/qCDjWxW/yes.png',
              imageWidth: 200,
              imageAlt: 'Custom image',
            })
            await this.delay(2)
            this.router.navigateByUrl('/inicio');
            break;
          case "grey":
            Swal.fire(
              'Excelente',
              'Confirma tu cuenta de email',
              'success'
            )
            environment.url = data.url
            
            this.router.navigateByUrl('/confirmacion');
            break;
          case "black":
            Swal.fire(
              'Excelente',
              'Confirma tu cuenta de email',
              'success'
            )
            environment.url = data.url
            
            this.router.navigateByUrl('/confirmacion');

            break;
          default:
            Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: 'Intentalo mas tarde'
            });
            break;
        }
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Email o contraseña incorrecta',
          imageUrl: 'https://i.ibb.co/QQ7d4HV/stop.png',
          imageWidth: 200,
          imageAlt: 'Custom image',
        })
      }
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Email o contraseña incorrecta',
        imageUrl: 'https://i.ibb.co/QQ7d4HV/stop.png',
        imageWidth: 200,
        imageAlt: 'Custom image',
      })
      console.log(error);
    });
  }

  delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }
}

