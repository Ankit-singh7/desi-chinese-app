import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../dashboard/router.page';
import { SubjectService } from '../services/subject/subject.service';

@Component({
  selector: 'app-in-dispatch',
  templateUrl: './in-dispatch.page.html',
  styleUrls: ['./in-dispatch.page.scss'],
})
export class InDispatchPage extends RouterPage {
  public billArray = [];
  userName: any;

  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private subjectService: SubjectService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute) { 
      super(router,route)
      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })
    }


    onEnter(){
      this.getAllBills();
      this.getCurrentStatus();
    }


    async getAllBills(){
      let loader = await this.loading.create({
        message: 'Please wait...',
      });
  
      loader.present().then(() => {
        this.invoiceService.getAllCookedBill().subscribe((res) => {
            if(res.data) {
  
              this.billArray = res.data.result
            }
             loader.dismiss()
        }, err => loader.dismiss())
  
      })
    }


    async changeBillStatus(id) {
      let loader = await this.loading.create({
        message: 'Please wait...',
      });
      loader.present().then(() => {

        const payload = {
          status: 'dispatchedAt'
        }
        this.invoiceService.changeBillStatus(payload,id).subscribe((res) => {
            loader.dismiss();
            this.billArray = this.billArray.filter((item) => item.bill_id !== id)
        },err => {
          loader.dismiss()
        })
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
