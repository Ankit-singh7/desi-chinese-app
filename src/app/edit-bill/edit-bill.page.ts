import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Platform, LoadingController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File,FileEntry, IWriteOptions } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import domtoimage from 'dom-to-image';
@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.page.html',
  styleUrls: ['./edit-bill.page.scss'],
})
export class EditBillPage implements OnInit {

  public billId:any;
  public billDetail: any;
  public selectedItems = [];
  public categoryList = [];
  public subCategoryList = [];
  public selectedCategory:any;
  public showDropDown = false;
  public arrowClass = "arrow-down";
  public formattedDate;
  public name:string;
  public phone: string;
  public altPhone: string;
  public address: string;
  public selectedDeliveryMode: any;
  public selectedPaymentMode: any;
  public selectedPaymentMode_2: any;
  public formError = false;
  public message = '';
  public sessionId:any;
  public drawerBalance: any;
  public cashIncome:any;
  netBanking = false;
  showDetail = true;
  dual_payment = false;
  payment = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'GooglePay' },
    { id: 3, name: 'PhonePe' },
    { id: 4, name: 'Card' },
    { id: 5, name: 'PayTm' }
  ];

  mode = [
    { id: 1, name: 'Home Delivery' },
    { id: 2, name: 'Parcel' },
    { id: 3, name: 'Dine-in' },
    { id: 4, name: 'Swiggy' },
    { id: 5, name: 'Zomato' }
  ]
  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private router: Router,
    private socialSharing: SocialSharing,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
           this.billId = params['id'];
           this.getBillDetail(this.billId)
      })

    }

  ngOnInit() {
  }

  ionViewDidLeave(){
    this.showDetail = true
  }


  onDualChange(){
    console.log(this.dual_payment)
  }


  async getBillDetail(id){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      this.invoiceService.getBillDetail(id).subscribe((res) => {
      if(res.data) {
        this.billDetail = res.data
        if(this.billDetail.dual_payment_mode === 'true') {
          this.dual_payment = true
        } else {
          this.dual_payment = false
        }

        console.log(this.dual_payment)
        if(this.billDetail.payment_mode === 'Net Banking') {
          this.selectedPaymentMode = {id:0,name:'Net Banking'}
        } else if(this.billDetail.payment_mode === 'Cash') {
          this.selectedPaymentMode = {id:1,name:'Cash'}
        } else if(this.billDetail.payment_mode === 'GooglePay') {
          this.selectedPaymentMode = {id:2,name:'GooglePay'}
        } else if(this.billDetail.payment_mode === 'PhonePe') {
          this.selectedPaymentMode = {id:3,name:'PhonePe'}
        } else if(this.billDetail.payment_mode === 'Card') {
          this.selectedPaymentMode = {id:4,name:'Card'}
        }else if(this.billDetail.payment_mode === 'PayTm') {
          this.selectedPaymentMode = {id:5,name:'PayTm'}
        }

        if(this.billDetail.payment_mode_2 === 'Net Banking') {
          this.selectedPaymentMode_2 = {id:0,name:'Net Banking'}
        } else if(this.billDetail.payment_mode_2 === 'Cash') {
          this.selectedPaymentMode_2 = {id:1,name:'Cash'}
        } else if(this.billDetail.payment_mode_2 === 'GooglePay') {
          this.selectedPaymentMode_2 = {id:2,name:'GooglePay'}
        } else if(this.billDetail.payment_mode_2 === 'PhonePe') {
          this.selectedPaymentMode_2 = {id:3,name:'PhonePe'}
        } else if(this.billDetail.payment_mode_2 === 'Card') {
          this.selectedPaymentMode_2 = {id:4,name:'Card'}
        }else if(this.billDetail.payment_mode_2 === 'PayTm') {
          this.selectedPaymentMode_2 = {id:5,name:'PayTm'}
        }


        if(this.billDetail.delivery_mode === 'Home Delivery') {
          this.selectedDeliveryMode = { id: 1, name: 'Home Delivery' }
        } else if(this.billDetail.delivery_mode === 'Parcel') {
          this.selectedDeliveryMode = { id: 2, name: 'Parcel' }
        } else if(this.billDetail.delivery_mode === 'Dine-in') {
          this.selectedDeliveryMode = { id: 3, name: 'Dine-in' }
        } else if(this.billDetail.delivery_mode === 'Swiggy') {
          this.selectedDeliveryMode = { id: 4, name: 'Swiggy' }
        } else if(this.billDetail.delivery_mode === 'Zomato') {
          this.selectedDeliveryMode = { id: 5, name: 'Zomato' }
        }


        console.log('payment', this.selectedPaymentMode)
        console.log('delivery', this.selectedDeliveryMode)


        this.formattedDate = moment(res.data.createdOn).format('DD/MM/yy');
      }
      loader.dismiss()
      }, err => loader.dismiss())
    })
  }


    paymentChange(event: {
    component: IonicSelectableComponent,
    value: any
  },val) {
    if(val === 'payment_1') {
      this.selectedPaymentMode  =''
      this.selectedPaymentMode = event.value
      
    } else if(val === 'payment_2'){
      this.selectedPaymentMode_2  =''
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
     if(this.selectedDeliveryMode.name === 'Swiggy' || this.selectedDeliveryMode.name === 'Zomato') {
       this.netBanking = true
       this.selectedPaymentMode = {id:0,name:'Net Banking'}
     }
  }



  async editBill(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      if(this.dual_payment){
        this.billDetail.payment_mode = this.selectedPaymentMode.name
        this.billDetail.payment_mode_2 = this.selectedPaymentMode_2.name
        this.billDetail.delivery_mode = this.selectedDeliveryMode.name
        this.billDetail.dual_payment_mode = this.dual_payment

      } else {
        this.billDetail.payment_mode = this.selectedPaymentMode.name
        this.billDetail.delivery_mode = this.selectedDeliveryMode.name
        this.billDetail.dual_payment_mode = this.dual_payment
      }
      this.invoiceService.updateBill(this.billDetail,this.billId).subscribe((res) => {
        this.router.navigate(['/con/billing-list'])
        loader.dismiss()
      },err=> {
        loader.dismiss()
      })
    }) 
  }

  async editandSendBill(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.billDetail.payment_mode = this.selectedPaymentMode.name
      this.billDetail.delivery_mode = this.selectedDeliveryMode.name
      this.invoiceService.updateBill(this.billDetail,this.billId).subscribe((res) => {
        this.domToI()
  
        loader.dismiss()
      },err=> {
        loader.dismiss()
      })
    }) 
  }


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
             this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.billDetail.customer_phone}`,`LOVE DESI CHINESE BILL,
             please click the link below to see your bill. Thank You Visit again`,`https://api.lovedesichinese.com/${res.path}`, `https://api.lovedesichinese.com/${res.path}`)
             this.phone = '';
             this.router.navigate(['/con/billing-list'])
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
