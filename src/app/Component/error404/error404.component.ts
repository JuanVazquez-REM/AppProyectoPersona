import { Component, OnInit } from '@angular/core';
import { CheckTokenService } from 'src/app/Services/check-token.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit {
  public rol:String;

  constructor(private check: CheckTokenService) { }

  ngOnInit(): void {
    this.check.checkToken()
    this.rol = this.check.rol
  }

}
