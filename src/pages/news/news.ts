import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ItemSliding, AlertController} from 'ionic-angular';
import {NewsModalPage} from '../news-modal/news-modal'
import * as moment from "moment";
import * as firebase from "firebase";
import {InAppBrowser} from '@ionic-native/in-app-browser';


/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  private newses : any;
  private  mode : any;
  private limit : any = 10;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController, private alertCtrl: AlertController,
              private iab : InAppBrowser) {
      this.initPage();
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
  add(){
    this.mode = "add";
    let profileModal = this.modalCtrl.create(NewsModalPage);
    profileModal.onDidDismiss(data => {
      console.log("Modal data");
      console.log(data);
      this.updateNews(data);
    });
    profileModal.present();
  }
  edit(item: ItemSliding, news){
    this.mode = "edit"
    item.close();
    let profileModal = this.modalCtrl.create(NewsModalPage, {
      mode: 'edit',
      news: news,
    });
    profileModal.onDidDismiss(data => {
      console.log("Modal data");
      console.log(data);
      this.updateNews(data);
    });
    profileModal.present();
  }
  delete(item: ItemSliding, news){
    item.close();
    const confirm = this.alertCtrl.create({
      title: 'News 삭제?',
      message: news.title+'삭제??',
      buttons: [
        {
          text: '아뇨',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '예',
          handler: () => {
            console.log('Agree clicked');
            var deleteRef = firebase.database().ref("news/"+news.key);
            deleteRef.remove();
          }
        }
      ]
    });
    confirm.present();
  }
  updateNews(data){
    if(this.mode === 'add'){
      var key = firebase.database().ref().child('news/').push().key;
      let timeStamp = firebase.database.ServerValue.TIMESTAMP;
      console.log(timeStamp);
      var tmpNews = {
        title : data.title,
        category : data.category,
        source : data.source,
        webUrl : data.webUrl,
        date : moment().format("YYYY-MM-DD:HH:mm:SS"),
        clickCount: 0,
        key : key,
        timestamp : timeStamp,
      };

      // Get a key for a new Post.
      // var newPostKey = firebase.database().ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/news/' + key] = tmpNews;
      // updates['/news-history/' + key] = tmpNews;

      firebase.database().ref().update(updates).then(() =>{
        var ref = firebase.database().ref("news/" + key);
        var stamp : any;
        ref.once('value',(item : any) => {
          stamp = item.val().timestamp * -1
        }).then(() =>{
          firebase.database().ref("news/"+ key).update({
            timestamp : stamp
          })
        })
      });
    }else if(this.mode ==='edit'){
      tmpNews = {
        title : data.title,
        category : data.category,
        source : data.source,
        webUrl : data.webUrl,
        date : data.date,
        clickCount: data.clickCount,
        key : data.key,
        timestamp : data.timestamp,
      };

      // Get a key for a new Post.
      // var newPostKey = firebase.database().ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/news/' + data.key] = tmpNews;
      // updates['/news-history/' + key] = tmpNews;

      firebase.database().ref().update(updates)
    }

  }
}
