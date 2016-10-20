import { HomePage } from '../home/home';
import { NavController, MenuController, Events, Page} from 'ionic-angular';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';

@Page({
    templateUrl: 'build/pages/item-details/caps-item-details.html',
    directives: [SummaryDetail]
    })
export class CapsItemDetails {
    selectedItem : any;
    selectedIndex : number;
    subCategories : string;
    constructor(private navCtrl: NavController, private events: Events){
      this.selectedItem = {"name" : "DEUTSCHE TELEKOM", "subCategories" :[
      {"value" : "DEUTSCHE TELEKOM", "name" : "CAP322346 CAP A"},
      {"value" : "AIRTEL TELEKOM", "name" : "CAP322347 CAP B"}
      ], "value" : true, "visible" : true};
      this.selectedIndex = 0;
      this.subCategories = this.selectedItem.subCategories;
    }

   mySlideOptions = {
    initialSlide: 0,
    loop: true,
    pager: true
  };
}
