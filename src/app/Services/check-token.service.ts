import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServiciosService } from '../servicios.service';
import Swal from 'sweetalert2';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  public rol:String;
  public session:Boolean = false
  public user:User;
  constructor(private api: ServiciosService,public router: Router, private cookies: CookieService) { }

  getSession():Boolean{
    return this.session
  }

  getRol(){
    return this.rol
  }


  checkToken(){
    this.api.check().subscribe(data => {
        if(data.status){
          this.rol = data.user.rol;
          this.session = true
          this.user = data.user
        }else{
          Swal.fire({
            title: 'Alto ahi pillin!',
            text: 'Algo salio mal con tu sesion',
            imageUrl: 'https://i.ibb.co/qFyxDjw/pillin.png',
            imageWidth: 200,
            imageAlt: 'Custom image',
          })
          this.cookies.delete("token")
          this.session = false
        }
    }, error =>{
      this.cookies.delete("token")
      this.session = false
    });
  }
}
