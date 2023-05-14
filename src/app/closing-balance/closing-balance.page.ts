import { Component } from '@angular/core';
import { RouterPage } from '../dashboard/router.page';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { InvoiceService } from '../services/invoice/invoice.service';
import { SubjectService } from '../services/subject/subject.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-closing-balance',
  templateUrl: './closing-balance.page.html',
  styleUrls: ['./closing-balance.page.scss'],
})
export class ClosingBalancePage extends RouterPage {

  public sessionDetail:any;
  public withdraw:any;
  public showError = false;
  public userName: any;
  public isWithdrawn = 'false';
  closing_balance: any;
  total: number = 0;

  constructor(private platform: Platform,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute) {
      super(router,route)
      
  }


  onEnter(){
    this.getCurrentStatus()
    console.log(this.isWithdrawn)
  }


  async getCurrentStatus() {
                      
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      this.invoiceService.getCurrentSession().subscribe((res) => {
        if(res.data === null) {
          this.presentPrompt()
          this.isWithdrawn = 'false'
        } else {
            this.subjectService.setSessionId(res.data.session_id);
            this.subjectService.setSessionBalance(Number(res.data.session_amount));
            this.sessionDetail = res.data
            this.isWithdrawn = res.data.isWithdrawn
            this.getAllBills();
        }
        loader.dismiss()
      },err => loader.dismiss())
    })
  }



  AddClosingBalance(){
      const payload = {
        closing_balance: this.closing_balance
      }
      this.invoiceService.updateSession(payload,this.sessionDetail.session_id).subscribe((res) => {
        this.closing_balance = '';
        this.getCurrentStatus()
      },err=>console.log(err))
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
                  this.subjectService.setSessionBalance(Number(res.data.session_amount));
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
          if(this.isWithdrawn === "true") {
            this.total  = this.total - this.sessionDetail.withdrawn
          }
        } else {
          this.total = 0;
        }
           loader.dismiss()
      }, err => loader.dismiss())

    })
  }


}
