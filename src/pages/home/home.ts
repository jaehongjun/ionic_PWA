import { Component } from '@angular/core';
import { NavController ,AlertController} from 'ionic-angular';

import * as firebase from 'firebase';
import * as moment from "moment";
import { ManagerPage } from '../manager/manager'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private userName : any;
  private userEmail : any;
  private userId : any;

  private masterEmail: any = "newsonmanager@gmail.com";
  private masterSwitch: any;

  private userProfile = {
    name: '',
    email: '',
    password: '',
    date: '',
    id: ''
  }
  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController) {
    // this.masterSwitch = true;
    this.getUserProfile();
  }

  gotoManagerPage(){
    this.navCtrl.push(ManagerPage);
  }
  async getUserProfile(){

    try {
      const userId = firebase.auth().currentUser.uid;
      console.log(userId);
      if(userId) {
        let userRef = firebase.database().ref("users/"+userId);
        console.log(userRef);
        userRef.once('value',(item: any) =>{
          if(item.val()){
            this.userProfile = {
              name: item.val().name,
              email: item.val().email,
              password: item.val().password,
              date: item.val().date,
              id: item.val().id
            }
          }else {
            console.log("no data");
          }
        }).then(() =>{
          console.log(this.userProfile);
          if(this.masterEmail === this.userProfile.email){
            this.masterSwitch = true;
          }else {
            this.masterSwitch = false;
          }
        }).catch((error) =>{
          console.log(error.errorMessage);
        })
      }
    } catch (error){
      console.log(error.errorMessage);
    }


    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
    });
  }
  logout(){

    let confirm = this.alertCtrl.create({
      title: 'Log out ',
      message: 'log out 하시겠습니까 ?',
      buttons: [
        {
          text: '아니오',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '예',
          handler: () => {
            firebase.auth().signOut().then(() => {
              console.log("log out");
            }).catch( (error) => {
              console.log("log out errror");
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
