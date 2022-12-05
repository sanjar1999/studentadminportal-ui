import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gender } from '../models/api-models/gender.model';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  private baseApiUrl = "https://localhost:8888";

  constructor(private httpCliend: HttpClient) { }

  getGenderList(): Observable<Gender[]>{
    return this.httpCliend.get<Gender[]>(this.baseApiUrl + '/genders');
  }
}
