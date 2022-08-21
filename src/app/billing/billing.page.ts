import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { File, FileEntry, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { RouterPage } from '../dashboard/router.page';
import { ActivatedRoute, Router } from '@angular/router';
import { generate } from 'shortid';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import domtoimage from 'dom-to-image';
import { ModeService } from '../services/mode/mode.service';




@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 'auto', opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: 'auto', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: 'auto', opacity: 1 }),
            animate('1s ease-in', 
                    style({ height: 'auto', opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class BillingPage extends RouterPage {

  public countryCode = '+91';
  public number = '7890891405';
  url:string = `https://wa.me/${this.countryCode}/${this.number}/?text=hi`
  public pdfObj = null;
  public selectedItems = [];
  public categoryList = [];
  public subCategoryList = [];
  public selectedCategory:any;
  public showDropDown = false;
  public arrowClass = "arrow-down";
  public date = new Date();
  public formattedDate = moment(this.date).format('DD/MM/yy');
  public name:string;
  public phone: string;
  public altPhone: string;
  public address: string;
  public selectedDeliveryMode: any;
  public selectedPaymentMode: any;
  public selectedPaymentMode_1:any;
  public selectedPaymentMode_2:any;
  public formError = false;
  public message = '';
  public sessionId:any;
  public drawerBalance: any;
  public cashIncome:any;
  public billDetail:any;
  public emptyMessage = 'Please select a category'
  public totalInput:Number = null
  public billCount;
  public discount = 0;
  public SGST = 0;
  public CGST = 0;
  payment = [];

  mode = []

  port: string;
  total = 0;
  item = 0;
  showCategory = true;
  showPayment = false;
  showBill = false;
  showDualPayment = false;
  userName: any;
  netBanking = false;
  dual_payment = false;
  split_amount_1 = null
  split_amount_2 = null
  branchDetail: any;

  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private printer: Printer,
    private invoiceService: InvoiceService,
    private modeService: ModeService,
    private loading: LoadingController,
    private subjectService: SubjectService,
    private alertController: AlertController,
    private router: Router,
    private socialSharing: SocialSharing,
    private pdfGenerator: PDFGenerator,
    private route: ActivatedRoute) {
      super(router,route)

      this.subjectService.getSessionId().subscribe((res) => {
        this.sessionId = res
      })

      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })


  

  }


  onEnter(){
    this.getMostlyUsedList()
    this.getCategoryList();
    // this.getCurrentStatus();
    this.getPaymentList();
    this.getModeList();
    this.getBranchDetail()
    this.getDiscount();
  }



  getPaymentList(){
    this.modeService.getPaymentModeList().subscribe((res) => {
      this.payment = res.data.map((item) => ({
        id: item.payment_mode_id,
        name: item.payment_mode_name
      }))
    })
  }

  getModeList(){
    this.modeService.getDeliveryModeList().subscribe((res) => {
      this.mode = res.data.map((item) => ({
        id: item.delivery_mode_id,
        name: item.delivery_mode_name,
        status: item.is_banking
      }))
    })
  }

  onDualChange(){
    console.log(this.dual_payment)
  }

  getDiscount(){
     this.invoiceService.getDiscount().subscribe((res) => {
       this.discount = res.data?.discount
       this.SGST  = res.data?.SGST;
       this.CGST = res.data?.CGST;
     })
  }



  categoryChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.selectedCategory = event.value
    console.log(this.selectedCategory);
    this.getSubCategoryList(this.selectedCategory.category_id);

  }

  paymentChange(event: {
    component: IonicSelectableComponent,
    value: any
  },val) {
    if(val === 'payment_single') {
      this.selectedPaymentMode  =''
      this.selectedPaymentMode = event.value  
    } else if( val === 'payment_1') {
      this.selectedPaymentMode_1 = ''
      this.selectedPaymentMode_1 = event.value
    } else if(val === 'payment_2') {
      this.selectedPaymentMode_2 = ''
      this.selectedPaymentMode_2 = event.value
    }
  }

  modeChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
     this.netBanking = false;
     this.selectedDeliveryMode = event.value
     console.log(this.selectedDeliveryMode)
     if(this.selectedDeliveryMode.status === 'true') {
       this.netBanking = true
       this.selectedPaymentMode = {id:0,name:'Net Banking'}
     } else{
       this.netBanking = false
       this.selectedPaymentMode = null
     }
  }

  async getBillCount(billId){
    this.formError = false;
    this.message = ''
    this.billCount = 0;
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.invoiceService.getAllBill().subscribe((res) => {
        if(res.data?.result) {
          if(res.data.result.length>0) {
            let tempCount = res.data?.result.length + 1;
            if(tempCount<=99) {

              this.billCount = ('0' + tempCount).slice(-2)   
            } else {
              this.billCount = ('0' + tempCount).slice(-3)   
            }
          } else {
            this.billCount = '01';
          }
          this.showGenerateBill(billId);
        } else {
          this.message = 'Something Went Wrong. Please Retry.'
          this.formError = true;
        }
       
        loader.dismiss()
      }, err => loader.dismiss())

    })
  }


  showEdit(val) {
    val.showIncrement = true
    this.total += val.price;
    this.item++;
      this.selectedItems.push(val)
      console.log(this.selectedItems)
  }

  increment(val:any) {
    val.count++
    this.total += val.price
    this.item++;
    for(let item of this.selectedItems) {
      if(item.sub_category_id === val.sub_category_id) {
        item.count = val.count
      }
    }

    console.log(this.selectedItems)
  }

  decrement(val) {
    if (val.count !== 1) {
      val.count--
      this.total -= val.price
      this.item--;
      for(let item of this.selectedItems) {
        if(item.sub_category_id === val.sub_category_id) {
          item.count = val.count
        }
      }
  
    } else {
      val.showIncrement = false;
      this.total -= val.price;
      this.item--;
      for(let i = 0; i<this.selectedItems.length; i++) {
        if(this.selectedItems[i].sub_category_id === val.sub_category_id) {
           this.selectedItems.splice(i,1);
        }
      }
    }


    console.log(this.selectedItems)


  }


  async getCategoryList() {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.invoiceService.getFoodCategory().subscribe((res) => {
        this.categoryList = res.data.result;
        this.categoryList = this.categoryList.sort((a,b) => (a.name).localeCompare(b.name))
        console.log(this.categoryList)
        loader.dismiss();
      }, err => loader.dismiss())
    })

  }


  async getSubCategoryList(id){
    this.subCategoryList = [];
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.invoiceService.getsubCategoryByCategoryId(id).subscribe((res) => {
        if(res.data) {

          this.subCategoryList = res.data.map((item) => ({
            ...item,
            'showIncrement': false,
            'count': 1
          }));

          this.subCategoryList = this.subCategoryList.sort((a,b) => (a.name).localeCompare(b.name))
  
          for (let item of this.selectedItems) {
             for(let list of this.subCategoryList) {
               if(item.sub_category_id === list.sub_category_id) {
                 list.count = item.count
                 list.showIncrement = true
               } else {
                 continue;
               }
             }
          }
        } else {
          this.emptyMessage = 'No items found.'
        }

        loader.dismiss();
        
      }, err => loader.dismiss())
    })
  }

  async getMostlyUsedList(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.invoiceService.getUsedFood().subscribe((res) => {
        if(res.data) {

          this.subCategoryList = res.data.map((item) => ({
            ...item,
            'showIncrement': false,
            'count': 1
          }));
          this.subCategoryList = this.subCategoryList.sort((a,b) => (a.name).localeCompare(b.name))
          console.log('sub',this.subCategoryList)
  
          for (let item of this.selectedItems) {
             for(let list of this.subCategoryList) {
               if(item.sub_category_id === list.sub_category_id) {
                 list.count = item.count
                 list.showIncrement = true
               } else {
                 continue;
               }
             }
          }
        } else {
          this.emptyMessage = 'No Mostly Used Food Added.'
        }

        loader.dismiss();
        
      }, err => loader.dismiss())
    })
  }


  togglePayment() {
    this.showCategory = false;
    this.showPayment = true;
    this.showBill = false;
    this.showDualPayment = false
    this.dual_payment = false;
  }

  toggleCategory() {
    this.getMostlyUsedList()
    this.showCategory = true;
    this.showPayment = false;
    this.showBill = false;
    this.showDualPayment = false
  }

  toggleBill() {
    this.showDualPayment = false;
    this.showCategory = false;
    this.showPayment = false;
    this.showBill = true;
    this.showDualPayment = false;
  }

  toggleSplitAmount(){
    this.showCategory = false;
    this.showPayment = false;
    this.showBill = false;
    this.showDualPayment = true
  }

  getBranchDetail() {
    this.invoiceService.getBranchDetail('QtdSQrKuq').subscribe((res) => {
      if(res.data) {
        this.branchDetail = res.data
      }
    })
  }


  deleteSelectedItem(val){
    console.log(val)

    for (let i = 0; i<this.selectedItems.length;i++){
     if(val.sub_category_id === this.selectedItems[i].sub_category_id) {
       this.total = this.total - (val.count * val.price)
       this.item  = this.item - val.count
       this.selectedItems.splice(i,1)
     }
       
    }
      for(let list of this.subCategoryList) {
        if(val.sub_category_id === list.sub_category_id) {
          list.count = 1
          list.showIncrement = false
        } else {
          continue;
        }
      }
  }

  incrementSelectedItem(val){
        val.count++
        this.item++
        this.total = this.total + val.price
        for(let list of this.subCategoryList) {
          if(val.sub_category_id === list.sub_category_id) {
            list.count = val.count
          } else {
            continue;
          }
        }
  }

  decrementSelectedItem(val){
    if(val.count === 1 ) {
      this.deleteSelectedItem(val)
    } else {
      val.count--
      this.item--
      this.total = this.total - val.price
      for(let list of this.subCategoryList) {
        if(val.sub_category_id === list.sub_category_id) {
          list.count = val.count
        } else {
          continue;
        }
      }
    }
}

  toggledropDown(){
    this.showDropDown = !this.showDropDown
    if(this.showDropDown === true) {
      this.arrowClass = 'arrow-up'
    } else {
      this.arrowClass = 'arrow-down'
    }
  }

  checkValidation() {
    this.formError = false;
    if(!this.selectedPaymentMode && !this.dual_payment) {
      this.message = 'Payment mode is required.'
      this.formError = true;
    } else if(!this.selectedPaymentMode_1 && !this.selectedPaymentMode_2  && this.dual_payment) {
      this.message = 'Please select both payment modes.'
      this.formError = true;
    }
      else if(!this.selectedDeliveryMode) {
      this.message = 'Delivery mode is required.'
      this.formError = true;
    } else if((this.selectedDeliveryMode.name === 'Swiggy' || this.selectedDeliveryMode.name === 'Zomato')&& !this.dual_payment) {
      if(!this.totalInput) {
        this.message = 'Total Bill Amount is required'
        this.formError = true;
      } else {
        this.formError = false;
        let billId = `CH-${generate()}`;
        this.getBillCount(billId)
       
      }
    } else {
      this.formError = false;
      let billId = `CH-${generate()}`;
      this.getBillCount(billId)
    }
  }

  downloadPdf() {
    if (this.platform.is('cordova')) {

    } else {
      this.pdfObj.download();
    }
  }


  async showGenerateBill(id){
     let total;
     if(this.selectedDeliveryMode?.name === 'Swiggy' || this.selectedDeliveryMode?.name === 'Zomato') {
       total = this.totalInput
     } else if(this.selectedDeliveryMode?.name === 'Dine-in' || this.selectedDeliveryMode?.name === 'Dine-In') {
       let sgst = (this.SGST/100)*Number(this.total)
       let cgst = (this.CGST/100)*Number(this.total)
       let service_charge = (this.discount/100)*Number(this.total)
       total = Math.round(Number(sgst + cgst + service_charge + this.total))
     } else {
       total = this.total
     }


      
      let tempArr = this.selectedItems.map((item) => ({
        food_name:item.name,
        food_id: item.sub_category_id,
        quantity: item.count,
        price: item.price
      }))
      let data;
      if(!this.dual_payment) {

        data = {
          bill_id: id,
          token_id: `LDC-${this.billCount}`,
          user_name: this.userName,
          customer_name: this.name,
          customer_phone: this.phone,
          customer_alternative_phone: this.altPhone,
          customer_address: this.address,
          payment_mode_1: this.selectedPaymentMode?.name,
          delivery_mode: this.selectedDeliveryMode?.name,
          total_price: total,
          products: tempArr,
          dual_payment_mode: this.dual_payment
        }
      } else if(this.dual_payment) {
        let total_price = parseInt(this.split_amount_1) + parseInt(this.split_amount_2)
        let sgst = (this.SGST/100)*Number(total_price)
        let cgst = (this.CGST/100)*Number(total_price)
        let service_charge = (this.discount/100)*Number(total_price)
        let total = Math.round(Number(sgst + cgst + service_charge + total_price))
        data = {
          bill_id: id,
          token_id: `LDC-${this.billCount}`,
          user_name: this.userName,
          customer_name: this.name,
          customer_phone: this.phone,
          customer_alternative_phone: this.altPhone,
          customer_address: this.address,
          payment_mode_1: this.selectedPaymentMode_1?.name,
          payment_mode_2: this.selectedPaymentMode_2?.name,
          delivery_mode: this.selectedDeliveryMode?.name,
          total_price: total,
          split_amount_1: this.split_amount_1,
          split_amount_2: this.split_amount_2,
          products: tempArr,
          dual_payment_mode: this.dual_payment
        }
      }
     this.billDetail = data;
     console.log(this.billDetail)

      this.toggleBill();
  

  }


  updateDrawerBalance(bal,id){
    console.log('update drawer balance')
    let totalCashIncome = Number(bal) + Number(this.cashIncome)
    let drawerBalance = Number(this.drawerBalance) + Number(bal)
    const data = {
      cash_income: totalCashIncome,
      drawer_balance: drawerBalance
    }
    this.invoiceService.updateSession(data,id).subscribe((res) => {

    },err => console.log(err))

  }


  getCurrentStatus() {
    this.invoiceService.getCurrentSession().subscribe((res) => {
      if(res.data === null){
        this.presentPrompt()
        this.subjectService.setCanWithdraw('true')
      } else {
        this.cashIncome = Number(res.data.cash_income)
        this.drawerBalance = Number(res.data.drawer_balance)
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



  // For creating a blob file to send to backend
  // async readFile(file: any) {
  //   console.log('file',file)
  //   // this.background.enable();
  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     const imgBlob = new Blob([reader.result], {
  //       type: file.type
  //     });

  //     let form = new FormData()

  //       form.append('pdf', imgBlob, file.name);
  //       this.invoiceService.uploadPdf(form).subscribe((res) => {
  //          if(res) { 
  //            this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.phone}`,`LOVE DESI CHINESE BILL`,`https://afternoon-shore-07470.herokuapp.com/${res.path}`, null)
  //            this.phone = '';
  //          }
  //       })
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  async createBill(data){
  
    let loader = await this.loading.create({
      message: 'Please wait...',
      duration:3000
    });

    loader.present().then(() => {
      this.invoiceService.createBill(data).subscribe((res) => {
        if(this.phone) {
          this.domToI()
          this.name = '';
          this.address = '',
          this.selectedPaymentMode = '';
          this.selectedDeliveryMode = '';
          this.total = 0;
          this.item = 0;
          this.selectedItems = [];
          this.subCategoryList = [];
          this.selectedCategory = '';
         
          // if(data.payment_mode === 'Cash') {
          //   this.updateDrawerBalance(data.total_price,this.sessionId)
          // }
          // this.printBill()
            loader.dismiss()
        } else {
          this.phone = '';
          this.totalInput = null;
          this.toggleCategory();
          this.name = '';
          this.address = '',
          this.selectedPaymentMode = '';
          this.selectedDeliveryMode = '';
          this.total = 0;
          this.item = 0;
          this.selectedItems = [];
          this.subCategoryList = [];
          this.selectedCategory = '';
         
          // if(data.payment_mode === 'Cash') {
          //   this.updateDrawerBalance(data.total_price,this.sessionId)
          // }
          // this.printBill()
            loader.dismiss()
        }

        this.netBanking = false

      }, err => loader.dismiss())

      loader.dismiss()
    })


}




// uploadBill(){
//   let printContent = document.getElementById('bill2').innerHTML;
//   let options = {
//     documentSize: 'A7',
//     fileName: 'bill.pdf'
//   }

//  this.pdfGenerator.fromData(`
//  <html>
//  <head>
//     <meta http-equiv="content-type" content="text/html; charset=windows-1252"/>
//        <title>DIN A4 Page</title>
//         <style type="text/css">
//             @page { size: 21cm 29.7cm; margin: 2cm }
//              p { line-height: 120%; text-align: justify; background: transparent }
//         </style>
//   </head>
//       <body style="background-color:#f6f6f6">
//             ${printContent}
//      </body>
//   </html>`, options)
// .then((base64)=> {
//   console.log(base64)
//   const byteArray = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
//   return new Blob([byteArray], {type: 'application/pdf'}); 
// }).then((blob) => {
//   const name = new Date().getTime() + '.pdf';
//   const url = window.URL.createObjectURL(blob);
//   const path = this.file.dataDirectory;
//   const options: IWriteOptions = { replace: true };
//   this.file.writeFile(path, name, blob, options).then(res => {
//     this.file.resolveLocalFilesystemUrl(res.nativeURL).then((entry: FileEntry) => {
//       entry.file(file => {
//           this.readFile(file);
//       });
//     });
//     console.log(res);
//   });

// })
// }


  async domToI(){
  let loader = await this.loading.create({
    message: 'Generating Bill...',
  });

  loader.present().then(() => {
    
    let markup = document.getElementById('bill');
     domtoimage.toBlob(markup).then((blob) => {
      const name = new Date().getTime() + '.png';
       console.log(blob)
      let form = new FormData()
      form.append('pdf', blob, name);
      this.invoiceService.uploadPdf(form).subscribe((res) => {
        console.log('here')
         if(res) { 
           this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.phone}`,`LOVE DESI CHINESE BILL,
           please click the link below to see your bill. Thank You Visit again`,`https://api.lovedesichinese.com/${res.path}`, `https://api.lovedesichinese.com/${res.path}`)
           this.phone = '';
           this.toggleCategory();
           loader.dismiss()
         }
         loader.dismiss()
      })
    })
     .catch(function (error) {
      console.error('oops, something went wrong!', error);
      loader.dismiss()
      });
  })
}





}
