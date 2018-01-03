
import { Component, Input, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerAuthGuard } from './Customer_AuthGuard';
import { AppointmentService } from '../RESTFul_API_Service/Appointment.service';





"use strict";

@Component({
  selector: 'Appointment-Modal',
  templateUrl: './Customer_MakeAppointment_Modal.html',
  styleUrls: ['./Customer_MakeAppointment_Modal.css'],

})


export class AppointmentModal {

  date: Date;
  //booke : string[] = ['25 11 2017' , '02 12 2017'];
  booke: string[] = [];
  blocks: Date[] = [];
  datepickerOpts = {     /* startDate: new Date(2016, 5, 10), */
    autoclose: true, todayBtn: 'linked',
    todayHighlight: true, assumeNearbyYear: true,
    format: 'd MM yyyy', icon: 'fa fa-calendar',
    datesDisabled: this.booke, clearBtn: true,
    startDate: new Date(), showOnFocus: true,
    endDate: new Date(2018, 2)
  };

  //If we remove type casting <any> it will throw error
  timepickerOpts: any[] = <any>{
    icon: 'fa fa-clock-o',
    showMeridian: false,
    minuteStep: 1,
    defaultTime: 'current'
  };
  /* @Input('docProfileEvent') profileList = <any>[] ; */
  /* @Output() docProfileEvent = <any>[];
  name:any; */

  doctorMemberId: any;
  doctorName: any;
  patientCarrier: any;
  patientData = <any>{};
  consultingReason: any = '';
  valuesEntered: boolean;
  map = <any>{};
  myDate: Date;
  availableTimes: any[] = [];



  constructor(private route: Router, private appoint: AppointmentService) {

    this.appoint.getDoctorAndPaitentMemberId()
      .subscribe(
      (result: any) => {
        /* console.log(result);  
        console.log(result[0]);             
        console.log(result[1]);  
        console.log(result[2]); 
        console.log(result[3]); */
        this.doctorMemberId = result[0];
        this.doctorName = result[1];
        this.patientCarrier = result[2];
        this.patientData = result[3];
      })


    this.getDoctorDates();




  }

  /* ngAfterContentInit(){

   this.map = new Map();
   this.myDate= new Date(2018,1,7);
   
   this.map.set(this.myDate,[new Date(2018,1,7,9,0).getTime() , new Date(2018,1,7,12,0).getTime() , new Date(2018,1,7,15,0).getTime()]);
   this.map.set(new Date(2018,1,8),[new Date(2018,1,7,8,0).getTime() , new Date(2018,1,8,12,0).getTime() , new Date(2018,1,8,15,0).getTime()]);
   this.map.set(new Date(2018,1,9),[new Date(2018,1,9,9,0).getTime() , new Date(2018,1,9,12,0).getTime() , new Date(2018,1,9,15,0).getTime()]);
   console.log(this.map.get(this.myDate));
  } */

  getAvailDates(dates: Date): any {
    //console.log("date entered is ", dates);
    this.map = new Map();
    this.myDate = new Date(2018, 0, 3);

    this.map.set(this.myDate, [new Date(2018, 0, 3, 9, 0).getTime(), new Date(2018, 0, 3, 12, 0).getTime(), new Date(2018, 0, 3, 15, 0).getTime()]);
    this.map.set(new Date(2018,1,8),[new Date(2018,1,8,8,0).getTime() , new Date(2018,1,8,12,0).getTime() , new Date(2018,1,8,15,0).getTime()]);
    this.map.set(new Date(2018,1,9),[new Date(2018,1,9,10,0).getTime() , new Date(2018,1,9,12,0).getTime() , new Date(2018,1,9,13,0).getTime()]);

    // console.log("my date", this.myDate);
    // console.log("my date", this.myDate);

    // console.log("check in the map", this.map.get(this.myDate));
    // console.log("check in the map", this.map.get(this.myDate));
    // console.log("keys length", this.map.keys());

    this.map.forEach((value: any, key: Date) => {
      if (key.getDay() == dates.getDay()) {
        this.availableTimes = value;
        console.log(this.availableTimes.length);
        return this.availableTimes;
      }
    });

  

    return this.availableTimes;
   
  }

  getDoctorDates(): any {


    var entries = {
      doctorMemberId: this.doctorMemberId
    }

    this.appoint.blockedDates(entries)
      .subscribe(

      (result: any) => {
        console.log(result.listOfBlockedDates);
        for (let data of result.listOfBlockedDates) {

          //booke.push(new Date(data).toLocaleDateString());
          this.blocks.push(new Date(data));
        }

        console.log(this.blocks);

      });



  }




  bookAppoint() {

    if (this.date && this.consultingReason) {
      var entries = <any>{}
      entries = {
        memberId: this.patientData.memberId,
        patientFirstName: this.patientData.firstName,
        patientLastName: this.patientData.lastName,
        contactNum: this.patientData.phone,
        carrierName: this.patientCarrier,
        appointDate: this.date.toISOString(), // Converting date to java script string noatation and result will be  "2017-11-27T11:30:18.992Z"
        reason: this.consultingReason,
        doctorMemberId: this.doctorMemberId
      }

      if (this.date.getTime() >= (Date.now() + 8.64e+7)) {
        console.log(entries);
        var temp;
        for (let data of this.blocks) {
          var selectedDate = this.date.setHours(0, 0, 0, 0);
          var bookedDate = data.setHours(0, 0, 0, 0);

          if (selectedDate.valueOf() === data.valueOf()) {
            temp = true;
            break;
          } else { temp = false; }


        }

        if (!temp) {
          this.appoint.bookAppointmentForDoctor(entries)
            .subscribe(
            (result: any) => {
              window.alert(result);
              (result) ? this.route.navigate(['home/' + this.patientData.memberId]) : null;
            },
            (err: any) => {
              window.alert(err);
              if (err) {
                this.consultingReason.clear();
                this.route.navigate(['home/' + this.patientData.memberId]);
              }
            });
        } else {

          window.alert("We are sorry appointment has already booked!!" +
            "Please try again for another date and time! Thank you for your patience!");
        }
      } else {
        window.alert("Appointment Not booked!! For Booking an apppintment you need to have atleast 24 " +
          "hours of time ,inconvenience regarded!! ");
      }
    } else {
      window.alert("You have missed some fields please check and enter properly")
    }

  }






  getDate(dt: Date): number {
    return dt && dt.getTime();
  }




}


