import { Injectable } from '@angular/core';
import { environment} from 'src/environments/environment.prod';
import { HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import { User } from './Interfaces/user';
import { CookieService } from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  apiURL=environment.apiURL
  constructor(private http:HttpClient, private cookies: CookieService) { }

  setToken(token) {
    this.cookies.set("token", token);
  }
  
  getToken() {
    return this.cookies.get("token");
  }

  register(request: Object):Observable<any>{
    return this.http.post<User>(`${this.apiURL}register`, request)
  }

  login(request: Object):Observable<any>{
    return this.http.post<User>(`${this.apiURL}login`, request)
  }

  confirmacion(url:String,request: Object):Observable<any>{
    return this.http.post<User>(`${url}`,request)
  }

  getBlack(request: Object):Observable<any>{
    return this.http.post<User>(`${this.apiURL}get/black`,request)
  }

  getPosts():Observable<any>{
    return this.http.get<any>(`${this.apiURL}post`)
  }
  
  createPost(request: Object):Observable<any>{
    return this.http.post<any>(`${this.apiURL}post`,request)
  }

  deletePost(id):Observable<any>{
    return this.http.delete<any>(`${this.apiURL}post`+`/${id}`)
  }

  updatePost(id, request: Object):Observable<any>{
    return this.http.put<any>(`${this.apiURL}post`+`/${id}`,request)
  }

  getPostById(id):Observable<any>{
    return this.http.get<any>(`${this.apiURL}post`+`/${id}`)
  }

  logout():Observable<any>{
    return this.http.get<any>(`${this.apiURL}logout`)
  }

  saveCodePermise(request: Object):Observable<any>{
    return this.http.post<any>(`${this.apiURL}codigo`,request)
  }

  verifyCodePermise(request: Object):Observable<any>{
    return this.http.post<any>(`${this.apiURL}verify/codigo`,request)
  }

  check():Observable<any>{
    return this.http.get<any>(`${this.apiURL}check`)
  }
}
