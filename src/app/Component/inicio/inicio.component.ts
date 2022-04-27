import { Component, OnInit } from '@angular/core';
import { CheckTokenService } from 'src/app/Services/check-token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public rol:String;
  constructor(private check: CheckTokenService) { }

  ngOnInit(): void {
    this.check.checkToken()
    this.rol = this.check.rol
  }

}
