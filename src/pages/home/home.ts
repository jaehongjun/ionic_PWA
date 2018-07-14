import { ManagerPage } from '../manager/manager'
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ItemSliding, AlertController} from 'ionic-angular';
import {NewsModalPage} from '../news-modal/news-modal'
import * as moment from "moment";
import * as firebase from "firebase";
import {InAppBrowser} from '@ionic-native/in-app-browser';
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
  private newses : any;
  private  mode : any;
  private limit : any = 10;
  private userProfile = {
    name: '',
    email: '',
    password: '',
    date: '',
    id: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController, private alertCtrl: AlertController,
              private iab : InAppBrowser) {
    this.getUserProfile();
    this.initPage();
  }
  gotoManagerPage(){
    this.navCtrl.push(ManagerPage);
  }
  clickNews(news){
    const browser = this.iab.create(news.webUrl);
  }
  async initPage(){
    try {
      var newsRef = firebase.database().ref("news/").orderByChild('timestamp').limitToFirst(this.limit);
      const items = await newsRef.once("value");
      this.newses = [];
      console.log(items)
      if(items){
        items.forEach((item) =>{
          this.newses.push({
            title : item.val().title,
            category: item.val().category,
            date: item.val().date,
            webUrl:item.val().webUrl,
            source:item.val().source,
            clickCount:item.val().clickCount,
            key:item.val().key,
            timestamp: item.val().timestamp,
          })
        });
      }else{
        console.log("no new data")
      }
    } catch (error) {

    }
  }
  async doRefresh(refresher) {
    this.limit = 10;
    try {
      var newsRef = firebase.database().ref("news/").orderByChild('timestamp').limitToFirst(this.limit);
      const items = await newsRef.once("value");
      this.newses = [];
      console.log(items)
      if(items){
        items.forEach((item) =>{
          this.newses.push({
            title : item.val().title,
            category: item.val().category,
            date: item.val().date,
            webUrl:item.val().webUrl,
            source:item.val().source,
            clickCount:item.val().clickCount,
            key:item.val().key,
            timestamp: item.val().timestamp,
          })
        });
        console.log("infinite");
        console.log((this.newses.length));
      }else{
        console.log("no new data")
      }
    } catch (error) {

    }
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  async doInfinite(infiniteScroll) {
    this.limit += 10;
    try {
      var newsRef = firebase.database().ref("news/").orderByChild('timestamp').limitToFirst(this.limit);
      const items = await newsRef.once("value");
      this.newses = [];
      console.log(items)
      if(items){
        items.forEach((item) =>{
          console.log(item.title);
          this.newses.push({
            title : item.val().title,
            category: item.val().category,
            date: item.val().date,
            webUrl:item.val().webUrl,
            source:item.val().source,
            clickCount:item.val().clickCount,
            key:item.val().key,
            timestamp: item.val().timestamp,
          })
        });
        console.log("infinite");
        console.log((this.newses.length));
      }else{
        console.log("no new data")
      }
    } catch (error) {

    }
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
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

  search(){
    const prompt = this.alertCtrl.create({
      title: 'Search',
      message: "News On Search",
      inputs: [
        {
          name: 'keyword',
          placeholder: 'keyword',
        },

      ],
      buttons: [
        {
          text: '취소',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '검색',
          handler: data => {
            this.searchNews(data.keyword);
          }
        }
      ]
    });
    prompt.present();
  }

  searchNews(keyword){

    //전체 데이터 불러오기
    var tmpNews = [];
    var newsRef = firebase.database().ref("news/");
    newsRef.once('value',(items: any) =>{
      if (items.val()){
        items.forEach((item)=>{
          tmpNews.push({
            title : item.val().title,
            category: item.val().category,
            date: item.val().date,
            webUrl:item.val().webUrl,
            source:item.val().source,
            clickCount:item.val().clickCount,
            key:item.val().key,
            timestamp: item.val().timestamp,
          })
        })
      }else {
        console.log("nodata")
      }
    }).then(()=>{
      this.newses = [];
      if (keyword && keyword.trim() != '') {
        this.newses = tmpNews.filter((news) => {
          return (news.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
        })
      }
    }).catch((error)=>{
      console.log(error.message);
    })

  }

}
