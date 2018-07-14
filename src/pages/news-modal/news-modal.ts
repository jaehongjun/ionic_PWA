import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader"
@IonicPage()
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage {
  private news = {
    title: '',
    category: '',
    webUrl: '',
    source: '',
  };
  private categorys = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private loader : LoaderProvider) {

    var mode = this.navParams.get("mode");
    if (mode === "edit"){
      this.news = this.navParams.get("news");
    }

    this.getcategory();
  }

  async getcategory() {
    this.loader.show();
    try {
      var categoryRef = firebase.database().ref('categorys/');
      console.log(categoryRef)
      const items = await categoryRef.once("value");
      console.log(items);
      if(items){
        items.forEach((item) => {
          this.categorys.push({
            title : item.val().title,
            code: item.val().code,
          })
        })
      }
    }catch (error){
      console.log(error.message);
    }
    this.loader.hide();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  save(){
    this.viewCtrl.dismiss(this.news);
  }

}
