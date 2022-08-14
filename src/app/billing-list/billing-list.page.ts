import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../dashboard/router.page';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { ModeService } from '../services/mode/mode.service';

@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.page.html',
  styleUrls: ['./billing-list.page.scss'],
})
export class BillingListPage extends RouterPage{

  public billArray = [];
  public total:any;
  public search = '';
  public searchedInitial = '';
  public count = 0;
  public selectedDeliveryMode: any;
  public selectedPaymentMode: any;
  public selectedPaymentModeName: any;
  public selectedDeliveryModeName: any;

  public payment = [];

  public mode = []
  userName: any;

  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private modeService: ModeService,
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
   this.getAllBills()
  //  this.getTotalSales();
   this.getCurrentStatus();
   this.getPaymentList();
   this.getModeList();
 }

ionViewDidLeave(){
  console.log('leave calls')
  this.payment = [];
  this.mode = [];
}


 getPaymentList(){
  this.modeService.getPaymentModeList().subscribe((res) => {
    this.payment.push({id: 7, name: 'Net Banking'})
    let tempArr = res.data.map((item) => ({
      id: item.payment_mode_id,
      name: item.payment_mode_name
    }))
    this.payment = [...this.payment,...tempArr]
  })
  let obj = {id:1,name: 'All'}
  this.payment.push(obj)
}

getModeList(){
  this.modeService.getDeliveryModeList().subscribe((res) => {
    this.mode.push({id:1,name:'All'})
    let tempArr = res.data.map((item) => ({
      id: item.delivery_mode_id,
      name: item.delivery_mode_name
    }))
    this.mode = [...this.mode, ...tempArr]
  })
}




  async getAllBills(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });


    loader.present().then(() => {
      let data = {
         
        payment_mode: this.selectedPaymentModeName,
        delivery_mode: this.selectedDeliveryModeName
      }

 
        let filterStr = '';
        for (let item in data) {
           if(data[item]) {
             filterStr = `${filterStr}${item}=${data[item]}&`
           }
           }
      this.invoiceService.getAllBill(filterStr).subscribe((res) => {
          if(res.data) {

            this.billArray = res.data.result
            if(res.data?.result) {
      
              this.total = 0
              for(let item of res.data.result) {
                 this.total = this.total + item.total_price
              }
            } else {
              this.total = 0;
            }
            
          }
           loader.dismiss()
      }, err => loader.dismiss())

    })
  }


  searchedText() {
    this.searchedInitial = '';
    this.count = 0;
    if (this.search !== '') {
    this.searchedInitial = this.search.split(' ')[0].split('')[0].toUpperCase();
    }
    }

    paymentChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
      this.selectedPaymentMode = event.value
      this.selectedPaymentModeName = event.value.name
      if(this.selectedPaymentModeName === 'All') {
        this.selectedPaymentModeName = ''
      }
      this.getAllBills()
    }
  
    modeChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
       this.selectedDeliveryMode = event.value
       this.selectedDeliveryModeName = event.value.name
       if(this.selectedDeliveryModeName === 'All'){
            this.selectedDeliveryModeName = '';
       }

       this.getAllBills()
    }

    // getTotalSales = async () => {
    //   let loader = await this.loading.create({
    //     message: 'Please wait...',
    //   });
  
    //   loader.present().then(() => {
    //    let data = {
         
    //      payment_mode: this.selectedPaymentModeName,
    //      delivery_mode: this.selectedDeliveryModeName
    //    }

  
    //      let filterStr = '';
    //      for (let item in data) {
    //         if(data[item]) {
    //           filterStr = `${filterStr}${item}=${data[item]}&`
    //         }
    //         }
    //     this.invoiceService.getTotal(filterStr).subscribe((res) => {
    //       if(res.data) {
    //         let totalArr = res.data;
    //         this.total = 0
            
    //         for(let i of totalArr) {
    //           this.total = this.total + i.total
    //         }
    //         console.log(this.total)
    //         loader.dismiss()
    //       } else {
    //         this.total = 0;
    //         loader.dismiss()
    //       }
    //       loader.dismiss()
    //     },err=> loader.dismiss())
    //   })
    // }


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
