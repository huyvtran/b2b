import { HomePage } from '../home/home';
import { NavController, MenuController, Events, Alert ,Page} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/intro-page/intro-page.html'
})
export class IntroPage {
    constructor(private navCtrl: NavController,private events: Events){

    }

    goToHome(){
		  this.events.publish('user:go_to_home');
	}
}
