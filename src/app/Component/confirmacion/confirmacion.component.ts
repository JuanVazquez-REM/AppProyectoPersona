import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  request: Object
  confirmacionForm:FormGroup; 
  public rol:String
  

  constructor(private api: ServiciosService,private fb:FormBuilder,public router: Router,private check: CheckTokenService) {
    this.logForm();
  }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    if(environment.url == null){
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'Inicia sesion',
      })
      this.router.navigateByUrl('/login');
    }
    this.check.checkToken()
  }
  setRequest() {
    this.request = {
      codigo:this.confirmacionForm.get('codigo').value,
    };
  }

  logForm(): void {
    this.confirmacionForm = this.fb.group({
      codigo: ['',[Validators.required]],
    });
  }

  confirmacion() {
    this.setRequest()
    this.api.confirmacion(environment.url,this.request).subscribe(async data => {
      if(data.status){
        if(data.rol == "black"){
          this.check.user = data.user
          environment.blacktoken = true
          Swal.fire(
            'Muy bien',
            'Codigo de confirmacion valido',
            'success'
            )
          this.router.navigateByUrl("/confirmacion/celular")
        }else{
          this.api.setToken(data.token.token)
          Swal.fire(
            'Bienvenido',
            '',
            'success'
            )
            environment.url = null
            await this.delay(2);
            this.router.navigateByUrl('/inicio');
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Codigo incorrecto',
        })
      }
        
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'Intentalo mas tarde',
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
