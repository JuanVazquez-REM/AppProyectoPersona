import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/servicios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  request: Object
  registroForm:FormGroup; //Variable para validar forms
  
  constructor(private fb:FormBuilder, private api: ServiciosService, public router: Router) {
    this.crForm();
  }

  ngOnInit(): void {
  }

  registro() {
    
    this.setRequest();
    
    this.api.register(this.request).subscribe(data => {
      if(data.status){
        Swal.fire({
          title: 'Hola!',
          text: '',
          imageUrl: 'https://i.ibb.co/qCDjWxW/yes.png',
          imageWidth: 200,
          imageAlt: 'Custom image',
        })
        this.router.navigateByUrl('/login');
      }
    }, error =>{
      if(error.status == 400){
        Swal.fire({
          icon: 'error',
          title: 'Email o contraseña incorrecta',
          text: '',
        })
      }
    
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'Intentalo mas tarde',
      })
      console.log(error)
    });
  }
  
  //Setear adtos del formulario
  setRequest() {
    this.request = {
      nombre: this.registroForm.get('nombre').value,
      email: this.registroForm.get('email').value,
      password: this.registroForm.get('password').value,
      rol: "white"
    }
  }

    //Validor Formulario
  crForm(): void {
    this.registroForm = this.fb.group({
      nombre: ['',[Validators.required]],
      email: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

}
