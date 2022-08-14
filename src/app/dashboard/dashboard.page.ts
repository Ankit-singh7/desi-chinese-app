import { Component } from '@angular/core';
import { RouterPage } from './router.page';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SubjectService } from '../services/subject/subject.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends RouterPage {

  public total:any;
  public userName: any;

  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute) { 
      super(router,route)
      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })
    }

    onEnter(){
      this.getCurrentStatus();
      this.getAllBills();
      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })
    }




    async getAllBills(){
      let loader = await this.loading.create({
        message: 'Please wait...',
      });
  
      loader.present().then(() => {
        this.invoiceService.getAllBill().subscribe((res) => {
          if(res.data?.result) {
      
            this.total = 0
            for(let item of res.data.result) {
               this.total = this.total + item.total_price
            }
          } else {
            this.total = 0;
          }
             loader.dismiss()
        }, err => loader.dismiss())
  
      })
    }
  


    getCurrentStatus() {
      this.invoiceService.getCurrentSession().subscribe((res) => {
         if(res.data === null) {
           this.presentPrompt()
           this.subjectService.setCanWithdraw('true')
         } else {
             this.subjectService.setSessionId(res.data.session_id);
             this.subjectService.setSessionBalance(Number(res.data.session_amount));
         }
      })
    }





    async presentPrompt() {
      let alert =await this.alertController.create({
        header: 'Start your Session',
        subHeader:'Enter an opening balance to start the day.',
        mode: 'ios',
        backdropDismiss: false,
        inputs: [
          {
            name: 'amount',
            placeholder: 'Opening Balance',
            type: 'number'
          },
        ],
        buttons: [
          {
            text: 'Submit',
            handler: async data => {
  
              if(data.amount) {
                            
                let loader = await this.loading.create({
                  message: 'Please wait...',
                });
            
                loader.present().then(() => {
  
              
                  const obj = {
                   session_status:'true',
                   session_amount: Number(data.amount),
                   user_name: this.userName,
                   drawer_balance: Number(data.amount)
                  }
   
                  this.invoiceService.enterSessionAmount(obj).subscribe((res) => {
                    this.subjectService.setSessionId(res.data.session_id);
                    this.subjectService.setSessionBalance(res.data.session_amount);
                       loader.dismiss();
                  },err => {
                    loader.dismiss();
   
                  })
                })
              } else {
                this.presentPrompt();
              }
            }
          }
        ]
      });
      await alert.present();
    }
  

}
