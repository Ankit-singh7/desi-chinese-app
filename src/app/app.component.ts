import { Component } from '@angular/core';
import { MenuController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { SubjectService } from './services/subject/subject.service';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private menu: MenuController,
    public subjectService: SubjectService,
    public loading: LoadingController,
    private router: Router,
    ) {
      this.initializeApp();
    }

  closeMenu() {
    this.menu.close();
  }


  initializeApp(){
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    })
  }




  async logout(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });
    loader.present().then(() => {
      localStorage.setItem('isLoggedIn', 'false');
      this.subjectService.setLoginStatus('false');
      this.router.navigate(['/home'])
      loader.dismiss();
    })
  }



}
