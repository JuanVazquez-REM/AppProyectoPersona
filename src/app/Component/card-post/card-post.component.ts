import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/Interfaces/post';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent implements OnInit {
  @Input() posts:Post
  constructor() { }

  ngOnInit(): void {
  }

}
