import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ItemSliding } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from "moment";
/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  private categorys : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController) {
    this.getCategory();
  }

  getCategory(){
    var userRef = firebase.database().ref('categorys/');
    console.log(userRef);
    userRef.on('value', (items: any) =>{
      //updateStarCount(postElement, snapshot.val());
      this.categorys = [];
      if(items.val()){
        items.forEach((items) => {
          this.categorys.push({
            title: items.val().title,
            code: items.val().code,
            date:items.val().date,

          })
        })
      } else {
        console.log('No data');
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  add(){
    const prompt = this.alertCtrl.create({
      title: '카테고리 정보 입력',
      message: "카테고리 정보를 입력하여 주세요.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'code',
          placeholder: 'code'
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
          text: '저장',
          handler: data => {
            console.log('Saved clicked');
            var tmpCategory = {
              title: data.title,
              code: data.code,
              date: moment().format('YYYY-MM-DD'),
            };

            // Get a key for a new Post.
            // var newPostKey = firebase.database().ref().child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/categorys/' + data.code] = tmpCategory;
            updates['/categorys-history/' + data.code] = tmpCategory;

            firebase.database().ref().update(updates);
          }
        }
      ]
    });
    prompt.present();
  }

  edit(item: ItemSliding ,category){
    item.close();
    const prompt = this.alertCtrl.create({
      title: '카테고리 정보 입력',
      message: "카테고리 정보를 입력하여 주세요.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: category.title,
        },
        {
          name: 'code',
          placeholder: 'code',
          value: category.code,
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
          text: '저장',
          handler: data => {
            console.log('Saved clicked');
            var tmpCategory = {
              title: data.title,
              code: data.code,
              date: moment().format('YYYY-MM-DD'),
            };

            // Get a key for a new Post.
            // var newPostKey = firebase.database().ref().child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/categorys/' + data.code] = tmpCategory;
            updates['/categorys-history/' + data.code] = tmpCategory;

            firebase.database().ref().update(updates);
          }
        }
      ]
    });
    prompt.present();
  }

  delete(item: ItemSliding, category){
    item.close();
    const confirm = this.alertCtrl.create({
      title: '카테고리 삭제?',
      message: category.title+'삭제??',
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
            var deleteRef = firebase.database().ref("categorys/"+category.code);
            deleteRef.remove();
          }
        }
      ]
    });
    confirm.present();
  }
}
