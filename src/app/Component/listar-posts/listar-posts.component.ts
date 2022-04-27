import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/Interfaces/post';
import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import Ws from '@adonisjs/websocket-client';
import { Data } from 'src/app/Interfaces/data';




@Component({
  selector: 'app-listar-posts',
  templateUrl: './listar-posts.component.html',
  styleUrls: ['./listar-posts.component.css']
})
export class ListarPostsComponent implements OnInit {
  public posts:Array<Post>
  public post:Boolean = false
  public request:Object
  public requestCode:Object
  updateForm:FormGroup; 
  codigoForm:FormGroup; 
  public tituloPlaceHolder:String;
  public textoPlaceHolder:String;
  public idPlaceHolder:Number = null;
  public rol:String;
  public userData:Object;
  public solicitudUser:Boolean;
  public data:Data = null
  public i = null
  public acceso:Boolean =false
  
  ws: any;
  chat: any;

  constructor(public router: Router,private api: ServiciosService,private check: CheckTokenService,private fb:FormBuilder) {
    this.logForm();
    this.codForm();
  }
  
  ngOnInit(): void {
    this.check.checkToken()
    this.rol = this.check.rol
    this.getPosts()
    console.log(this.rol)
  }

  getPosts(){
    this.api.getPosts().subscribe(data => {
      if(data.status){
        this.posts = data.posts
        this.post = true
      }else{
        Swal.fire(
          'Algo salio mal',
          'Intenta vizualizar los posts mas tarde',
          'warning'
        )
      }
    }, error =>{
      Swal.fire(
        'Algo salio mal',
        'Intenta vizualizar los posts mas tarde',
        'error'
      )
      console.log(error)
    });
  }


  deletePost(post){
    Swal.fire({
      title: 'Seguro que deseas eliminar el post?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.deletePost(post.id).subscribe(data => {
          this.getPosts()
          Swal.fire(
            'Post',
            'Elimando correctamente',
            'success'
          )
        }, error =>{
          console.log(error)
        });
      } else if (result.isDenied) {
        
      }
    })
    
  }

  getPostById(post){
    this.api.getPostById(post.id).subscribe(data => {
      if(data.status){
        this.tituloPlaceHolder = data.post.titulo
        this.textoPlaceHolder = data.post.texto
        this.idPlaceHolder = data.post.id
      }else{
        Swal.fire(
          'Algo salio mal',
          'Intenta editar el post tarde',
          'warning'
        )
        this.router.navigateByUrl("/listar/posts")
      }
    }, error =>{
      Swal.fire(
        'Algo salio mal',
        'Intenta editar el post tarde',
        'error'
      )
      this.router.navigateByUrl("/listar/posts")
      console.log(error)
    });
  }

  async updatePost(){
    this.check.checkToken()
    this.rol = this.check.rol

    if(this.rol == "white" || this.rol == "grey"){
      console.log("User Bajo")
      if(this.acceso){
        const { value: codigo } = await Swal.fire({
          title: 'Codigo de confirmacion',
          input: 'text',
          inputLabel: 'ingresa el codigo de confirmacion',
          inputPlaceholder: '',
        })
        
        this.api.verifyCodePermise({user_id:this.check.user.id,codigo:codigo}).subscribe(data => {
          if(data.status){
            this.updatePostDirect()
            this.acceso = false
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Codigo incorrecto',
              text: '',
            })
          }
        }, error =>{
          Swal.fire({
            icon: 'error',
            title: 'Algo salio mal',
            text: 'Intentelo mas tarde',
          })
          console.log(error)
        });
        


      }else{
        Swal.fire({
          title: 'No tienes permiso para realizar esta accion, deseas solicitar uno?',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.connectWS()
          } else if (result.isDenied) {
            this.acceso = false
          }
        })
      }
    }else{
      this.updatePostDirect()
    }
  }

  updatePostDirect(){
    this.setRequest()
      this.api.updatePost(this.idPlaceHolder,this.request).subscribe(data => {
        console.log(this.idPlaceHolder)
        console.log(this.request)
        console.log(data)
        if(data.status){
          this.getPosts()
          Swal.fire(
            'Post',
            'Editado correctamente',
            'success'
          )
        }else{
          Swal.fire(
            'Algo salio mal',
            'Intenta editar el post tarde',
            'warning'
          )
        }
      }, error =>{
        Swal.fire(
          'Algo salio mal',
          'Intenta editar el post tarde',
          'error'
        )
        console.log(error)
      });
  }

  setRequest() {
    this.request = {
      titulo:this.updateForm.get('titulo').value,
      texto:this.updateForm.get('texto').value
    };
  }

  setRequestCode(codigo) {
    this.requestCode = {
      codigo:codigo
    };
  }

  logForm(): void {
    this.updateForm = this.fb.group({
      titulo: ['',[Validators.required]],
      texto: ['',[Validators.required]]
    });
  }

  codForm(): void {
    this.codigoForm = this.fb.group({
      codigo: ['',[Validators.required]]
    });
  }

  checkRol(){
    this.check.checkToken()
    this.rol = this.check.rol

    if(this.rol == "white" || this.rol == "grey"){
      // conecte socket, mandar inf solicitando code (se queda en espera) hasta que el black genere y mande mensaje por el soctket,"black" reibe info manda peiticon a la api para generar un codigo lo genera y lo guarda

    }
  }

  getUserData(){
    this.check.checkToken()
    console.log(this.check.user)
    this.userData = {
      id: this.check.user.id,
      nombre: this.check.user.nombre,
      peticion: true,
      tipo:"confirmacion"
    }
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


  solicitud(){
    this.getUserData()
    this.chat.emit("message", this.userData); //Envio la informacion del sensor que quiero monitoriar1
    Swal.fire(
      'Solicitud enviada',
      'Por favor espera a que sea confirmada',
      'success'
    )
    this.chat.on("message", (data:any) =>{//recibir mesnajes que estan mandado otros clientes
      this.data = data
      console.log(this.data)
      this.statusSolicitud()
    })
  }

  statusSolicitud(){
    if(this.data.user.id == this.check.user.id){
      console.log("Info para mi")
      if(this.data.status){
        this.solicitudUser = true
        this.acceso = true
        //acceso yes
        console.log("yeeees, me lo aprobaron")
        Swal.fire(
          'Confirmado',
          'Un usuario de alto rango a autorizado tu accion.',
          'success'
        )
      }else{
        this.acceso = false
        this.solicitudUser = false
        Swal.fire(
          'Lo siento',
          'Un usuario de alto rango a denegado tu accion.',
          'error'
        )
        //acceso flase
        console.log("nooo, me lo negaron")
      }
    }
    
  }

  sendCodigo(){
    console.log("verificando codigo")
    //acceso = true
  }

  cancelar(){
    this.acceso = false
  }

}
