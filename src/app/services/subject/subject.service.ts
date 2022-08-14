import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RouterPage } from 'src/app/dashboard/router.page';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SubjectService extends RouterPage {


  public fullName =  new BehaviorSubject(null);
  public authToken = new BehaviorSubject(null);
  public userType = new BehaviorSubject(null);
  public isLoggedIn = new BehaviorSubject(null);
  public userId = new BehaviorSubject(null);
  public sessionId = new BehaviorSubject(null);
  public sessionBalance = new BehaviorSubject(null);
  public canWithdraw = new BehaviorSubject(null);



  constructor( private platform: Platform,
    private storage: Storage,
    private router: Router, 
    private route: ActivatedRoute) {
super(router,route)
}

  onEnter(){
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {

     this.storage.get('fullName').then((res) => {
       this.fullName.next(res)
     })

     this.storage.get('token').then((res) => {
       this.authToken.next(res)
     })

     this.storage.get('userType').then((res) => {
       this.userType.next(res);
     })


     this.storage.get('isLoggedIn').then((res) => {
       this.isLoggedIn.next(res);
     })


     this.storage.get('userId').then((res) => {
       this.userId.next(res);
     })

     this.storage.get('sessionId').then((res) => {
       this.sessionId.next(res)
     })

     this.storage.get('sessionBalance').then((res) => {
       this.sessionBalance.next(res)
     })

     this.storage.get('canWithdraw').then((res) => {
      this.canWithdraw.next(res)
    })

    })
  }










  setUserType(val) {
    // localStorage.setItem('userType', val);
    this.storage.set('userType', val)
    this.userType.next(val);
  }

  getUserType() {
    return this.userType.asObservable();
  }


  setToken(val) {
    localStorage.setItem('token', val);
    this.storage.set('token', val)
    this.authToken.next(val);
  }
  
  getToken(){
    return this.authToken.asObservable();
  }

  setFullName(val){
    // localStorage.setItem('fullName', val);
    this.storage.set('fullName', val)
    this.fullName.next(val);
  }

  getFullName() {
    return this.fullName.asObservable();
  }
  

  getLoginStatus(){
    return this.isLoggedIn.asObservable()
  }

  setLoginStatus(val){
    localStorage.setItem('isLoggedIn', val);
    this.storage.set('isLoggedIn', val)
    this.isLoggedIn.next(val)
  }


  getUserId(){
    return this.userId.asObservable()
  }

  setUserId(val){
    // localStorage.setItem('userId', val);
    this.storage.set('userId', val)
    this.userId.next(val)
  }


  getSessionId(){
    return this.sessionId.asObservable()
  }

  setSessionId(val){
    this.storage.set('sessionId',val)
    this.sessionId.next(val)
  }

  getSessionBalance(){
    return this.sessionBalance.asObservable()
  }

  setSessionBalance(val){
    this.storage.set('sessionBalance',val)
    this.sessionBalance.next(val)
  }

  getCanWithdraw(){
    return this.canWithdraw.asObservable()
  }

  setCanWithdraw(val){
    this.storage.set('canWithdraw', val)
    this.canWithdraw.next(val)
  }

}

