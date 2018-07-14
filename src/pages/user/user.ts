import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from "moment";
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  private users: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initPage();
  }
  initPage(){
    var userRef = firebase.database().ref('/users');
    console.log(userRef);
    userRef.on('value', (items: any) =>{
      //updateStarCount(postElement, snapshot.val());
      this.users = [];
      if(items.val()){
        items.forEach((items) => {
          this.users.push({
            name: items.val().name,
            email: items.val().email,
            password: items.val().password,
            date:items.val().date,
            id: items.val().id
          })
        })
      } else {
        console.log('No data');
      }
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

}
