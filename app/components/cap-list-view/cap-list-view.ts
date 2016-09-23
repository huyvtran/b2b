import {Component, Input} from '@angular/core';
import {NavParams} from 'ionic-angular';


@Component({
	selector:'cap-list-view',
	template:`
		<div class="list-view">
			<table style="width:100%;font-size:12px;">
		  	<tr>
			    <th style="width:80px;">Cap ID</th>
			    <th style="text-align:center">Level</th>
			    <th style="width:160px;">Customer</th>
			    <th>Age</th>
		    </tr>
			</table>
			<div class="inner_table">
			  <table style="font-size:12px;">
				  <tr *ngFor="let m of model">
				    <td style="width:80px;">{{m.caseNumber}}</td>
				    <td style="text-align:center">{{correctName(m.capLevel)}}</td>
				    <td style="width:160px;">{{m.customer}}</td>
				    <td>{{m.age}}</td>
				  </tr>
			  </table>
			</div>
		</div>
		`
})
export class CapListView  {
	public _model:any = [];

	@Input()
	set model(model){   // model.sort belwo will provide a sorting logic for alphabets
		this._model = model;
		/*.sort(function(a, b) {
		  var nameA = a.capLevel.toUpperCase(); // ignore upper and lowercase
		  var nameB = b.capLevel.toUpperCase(); // ignore upper and lowercase
		  if (nameA > nameB) {
		    return -1;
		  }
		  if (nameA < nameB) {
		    return 1;
		  }

		  // names must be equal
		  return 0;
		});*/
	};
	get model(){
		return this._model;
	};
	correctName(label){
		if(label.startsWith("CAP ")){
			var i = 4;
			return label.substring(i, label.length);
		}
		return label;
	};
}
