import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { WinbidUserComponent } from '../winbid-user/winbid-user.component';
import {HeaderService} from '../header/header.service';
import {FormGroup, FormBuilder, Validators, NgForm, FormControl} from '@angular/forms';
import { PaymentmethodsService } from '../paymentmethods/paymentmethods.service';
import {Subscription} from 'rxjs/Subscription';
import swal from 'sweetalert2'
@Component({
  selector: 'app-buynow-dialog',
  templateUrl: './buynow-dialog.component.html',
  styleUrls: ['./buynow-dialog.component.scss']
})
export class BuynowDialogComponent implements OnInit {
  constructor(private obj_payment_service:PaymentmethodsService,public dialogRef: MatDialogRef<WinbidUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public obj:HeaderService) { }
  CCV: FormGroup;
  CardNumber = '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$';
  ExpiryDate= '([0-9]{2}[/]?){2}';

 
  ngOnInit() {
    return this.obj_payment_service.showCards().subscribe(Response =>{
      this.res=Response;
})
  }
  res;
  status;
  // cardtype;
  // holdername
  public model: any = {};
  var_get_status;var_get_id;
  card_opeation=[
    {value: 'Visa', viewValue: 'Visa Card'},
    {value: 'Mastercard', viewValue: 'Master Card'},
    {value: 'American Express', viewValue: 'American Express'},
    {value: 'Discover', viewValue: 'Discover'}
    
    ];
 
    ExpiryDateForm = new FormControl('', [
      Validators.required,
      Validators.pattern('(0[1-9]|10|11|12)/[0-9]{2}$'),
    ]);
  
    CardNumberForm = new FormControl('', [
      Validators.required,
    ]);
  
    CardCodeForm = new FormControl('', [
      Validators.required,
    
    ]);
    Holdername = new FormControl('', [
      Validators.required
    ]);
    CardtypeForm = new FormControl('', [
      Validators.required,
      
    ]);
    Carddefault = new FormControl('', [
     
      
    ]);
    // TotalAmountForm = new FormControl('', [
    //   Validators.required
    // ]);
    expirydate;
    chek(val){
      // this.expirydate=val.toString().slice(3,7);
      this.expirydate=val.toString().slice(3,5);
      console.log(this.expirydate,'jj')
    }
    public mask=function(rawValue) {
     
      // add logic to generate your mask array  
      if (rawValue && rawValue.length > 0) {
          if (rawValue[0] == '0' || rawValue[5] == '1') {
              return [/[01]/, /[1-9]/, '/',  /[0-9]/, /[0123456789]/];
          } else {
              return [/[01]/, /[0-2]/, '/',  /[0-9]/, /[0123456789]/];
          }
      }
      return [/[01]/, /[0-9]/, '/',  /[0-9]/, /[0123456789]/];
      
  }
    endRequest ;
    public ccvmask =[/[0-9]/, /\d/, /\d/];
    public cardmask =[/[0-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  
    ShowButton(var_type_atm) {
      // this.cardtype = var_type_atm;
      if (var_type_atm == "American Express") {
       this.cardmask = [/[3]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
       this.ccvmask=[/[0-9]/, /\d/, /\d/,/\d/]
      }
      else if (var_type_atm == "Visa") {
       this.cardmask=[/[4]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
       this.ccvmask=[/[0-9]/, /\d/, /\d/]
      }
      else if (var_type_atm == "Mastercard") {
        this.cardmask=[/[5]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        this.ccvmask=[/[0-9]/, /\d/, /\d/]
       } else{
        this.cardmask=[/[6]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        this.ccvmask=[/[0-9]/, /\d/, /\d/]
       }
    }
    isright:boolean=false;
    set_default:boolean=false;
    Add_new(){
      alert(this.set_default)
    if(this.set_default==true){
      this.isright=false;
    }else if(this.set_default==false){
    this.isright=true;
    
    }
    }
  onSubmit() {
   
    this.obj.coursepayment( this.model.cardNumber.split('-').join(''), this.model.expirationdate.split('/').join(''),this.model.cardcod,this.var_get_id,this.data.course_id,this.model.cardtype,this.model.holdername).subscribe();
   
}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
