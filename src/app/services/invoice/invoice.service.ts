import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  public date = new Date();
  public formattedDate = moment(this.date).format('YYYY-MM-DD');

  constructor(private http: HttpClient) { }


  public getFoodCategory():Observable<any> {
    return this.http.get(`${environment.apiURL}/category/view/all?per_page=500&current_page=1`);
  }


  public getFoodSubCategory():Observable<any> {
    return this.http.get(`${environment.apiURL}/subcategory/all?per_page=500&current_page=1`);
  }

  public getUsedFood():Observable<any> {
    return this.http.get(`${environment.apiURL}/subcategory/used`)
  }

  public getsubCategoryByCategoryId(id):Observable<any> {
    return this.http.get(`${environment.apiURL}/category/${id}/getSubCatList`);
  }

  public createBill(data): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill/create`,data)
  }

  public getAllBill(paramStr?:any): Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=500&current_page=1&createdOn=${this.formattedDate}&${str}`)
  }


  getDiscount(): Observable<any> {
    return this.http.get(`${environment.apiURL}/bill/get_discount`)
  }

  public getAllInQueueBill(): Observable<any> {
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=500&current_page=1&createdOn=${this.formattedDate}&status=in-queue`)
  }

  public getAllInCookBill(): Observable<any> {
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=500&current_page=1&createdOn=${this.formattedDate}&status=in-cook`)
  }

  public getAllCookedBill(): Observable<any> {
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=500&current_page=1&createdOn=${this.formattedDate}&status=cookedAt`)
  }

  getBranchDetail(id): Observable<any> {
    return this.http.get(`${environment.apiURL}/branch/${id}`)
  }


  public changeBillStatus(data,id): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill/${id}/status`,data)
  }


  public updateBill(data,id): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill/${id}/update`,data)
  }


  public getBillDetail(id):Observable<any>{
    return this.http.get(`${environment.apiURL}/bill/${id}/getById`)
  }

  public getTotal(paramStr?:any): Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/bill/total?createdOn=${this.formattedDate}&${str}`)
  }

  getCurrentSession():Observable<any> {
    return this.http.get(`${environment.apiURL}/session/findCurrentStatus`)
  }

  enterSessionAmount(data):Observable<any> {
    return this.http.post(`${environment.apiURL}/session/create`,data)
  }

  updateSession(data,id): Observable<any>{
    return this.http.post(`${environment.apiURL}/session/${id}/update`,data)
  }

  uploadPdf(data): Observable<any>{
    return this.http.post(`${environment.apiURL}/bill/upload`,data)
  }


}
