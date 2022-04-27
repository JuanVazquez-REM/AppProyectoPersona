import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/Interfaces/post';
import { CheckTokenService } from 'src/app/Services/check-token.service';
import { ServiciosService } from 'src/app/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inter-post',
  templateUrl: './inter-post.component.html',
  styleUrls: ['./inter-post.component.css']
})
export class InterPostComponent implements OnInit {
  public request:Object;
  public posts:Array<Post>
  createForm:FormGroup; 
  
  constructor(private check: CheckTokenService,public router: Router,private api: ServiciosService,private fb:FormBuilder) { 
    this.logForm();
  }

  ngOnInit(): void {
    this.check.checkToken()
    this.getPosts()
  }

  getPosts(){
    this.api.getPosts().subscribe(data => {
      if(data.status){
        this.posts = data.posts
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

  createPost(){
    this.setRequest()
    this.api.createPost(this.request).subscribe(data => {
      if(data.status){
        Swal.fire(
          'Post',
          'Se creo correctamente',
          'success'
        )
        this.getPosts()
      }else{
        Swal.fire(
          'Algo salio mal',
          'Intenta crear un post mas tarde',
          'warning'
        )
      }
    }, error =>{
      Swal.fire(
        'Algo salio mal',
        'Intenta crear un post mas tarde',
        'error'
      )
      console.log(error)
    });
  }

  setRequest() {
    this.request = {
      titulo:this.createForm.get('titulo').value,
      texto:this.createForm.get('texto').value
    };
  }

  logForm(): void {
    this.createForm = this.fb.group({
      titulo: ['',[Validators.required]],
      texto: ['',[Validators.required]]
    });
  }



}
