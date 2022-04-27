import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import { environment } from 'src/environments/environment.prod';
import Ws from '@adonisjs/websocket-client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmacion-movil',
  templateUrl: './confirmacion-movil.component.html',
  styleUrls: ['./confirmacion-movil.component.css']
})

export class ConfirmacionMovilComponent implements OnInit {
  public dataWs = {
    tipo: null,
    status:null,
    user:{
      id:null
    }
  }
  

  public recived = {
    tipo: null,
    status:null,
    user:{
      id:null
    }
  }

  ws: any;
  chat: any;

  constructor(public router: Router,private check: CheckTokenService,private api: ServiciosService) { 
    
  }

  ngOnInit(): void {
    this.connectWS()
  }

  ngOnDestroy(): void {
    this.disconnectWS()
    environment.blacktoken = false
  }

  disconnectWS(){
    this.ws.close()
  }

  connectWS(){
    const opciones = {reconnection:true}
    this.ws = Ws(environment.wsURL,opciones); //ruta de mi web socket

    this.ws.connect(); //me conecto al ws
    this.chat = this.ws.subscribe("chat") //subscribo al canal
    this.solicitud()
  }

  setDataWs(){
    this.dataWs = {
      tipo: "tokenweb",
      status:true,
      user:{
        id:this.check.user.id
      }
    }
  }


  solicitud(){
    this.setDataWs()
    this.chat.emit("message", this.dataWs); //Envio la informacion del sensor que quiero monitoriar1
    this.chat.on("message", (data:any) =>{//recibir mesnajes que estan mandado otros clientes
      this.recived = data
      console.log(this.recived)
      this.checkResponse()
    })
  }


  checkResponse(){
    if(this.recived.tipo == "tokenmovil" && this.recived.user.id == this.check.user.id){
        if(this.recived.status){
          this.api.getBlack({user_id:this.check.user.id}).subscribe(async data => {
            if(data.status){
              this.api.setToken(data.token.token)
              this.check.checkToken()
              await this.delay(2)
              Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: '',
              })
              this.ws.close()
              this.router.navigateByUrl("/inicio")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salio mal',
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
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se denego el acceso',
          })
          environment.url = null
          environment.blacktoken = false
          this.router.navigateByUrl("/login")
          
        }
    }
  }

  delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }
}
