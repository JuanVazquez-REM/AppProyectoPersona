import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import Ws from '@adonisjs/websocket-client';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html', 
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public rol:String;
  public dataWs = {
    id: null,
    nombre: null,
    peticion: null,
    tipo: null
  }
  public messageResponse = {
    status: null,
    user:{
      id: null
    }
  }
  ws: any;
  chat: any;

  constructor(private cookies: CookieService,public router: Router,private check: CheckTokenService,private api: ServiciosService) { }

  ngOnInit(): void {
    this.check.checkToken()
    this.rol = this.check.rol
    if(this.rol == "black"){
      this.connectWs()
    }
  }

  cerrarSesion(){
    this.api.logout().subscribe(data => {
      if(data.status){
        Swal.fire({
          title: 'Bye!',
          text: 'No te extrañaremos',
          imageUrl: 'https://i.ibb.co/XF5ZQVx/triste.png',
          imageWidth: 200,
          imageAlt: 'Custom image',
        })
      }
      console.log(data)
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: '',
      })
      console.log(error)
    });
    this.cookies.delete("token")
    this.router.navigateByUrl('/login');
  }


  disconnectWS(){
    this.ws.close()
  }

  connectWs(){
    const opciones = {reconnection:true}
    this.ws = Ws(environment.wsURL,opciones); //ruta de mi web socket

    this.ws.connect(); //me conecto al ws
    this.chat = this.ws.subscribe("chat") //subscribo al canal
    this.solicitud()
  }


  solicitud(){
    this.chat.on("message", (data:any) =>{//recibir mesnajes que estan mandado otros clientes
      if(data.tipo=="confirmacion"){
        this.dataWs = data
        Swal.fire({
          title: 'El usuario '+ data.nombre +' desea administrar un post, deseas darle permiso?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si, generar codigo',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.onMessageYes()
            this.saveCodePermise()
          } else if (result.isDenied) {
            this.onMessageNo()
          }
        })
      }
    })
  }

  onMessageYes(){
    this.messageResponse.status = true
    this.messageResponse.user.id = this.dataWs.id
    this.chat.emit("message", this.messageResponse); 
  }

  onMessageNo(){
    this.messageResponse.status = false
    this.messageResponse.user.id = this.dataWs.id
    this.chat.emit("message", this.messageResponse); 
  }

  saveCodePermise(){
    this.api.saveCodePermise({user_id:this.messageResponse.user.id}).subscribe(data => {
      if(data.status){
        Swal.fire({
          icon: 'success',
          title: 'Codigo generado!',
          text: 'El codigo es: ' + data.code,
        })
      }
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'No se pudo generar el codigo',
      })
      console.log(error)
    });
  }


  

}


