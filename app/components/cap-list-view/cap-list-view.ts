import {Component, Input} from '@angular/core';
import {NavParams} from 'ionic-angular';


@Component({
	selector:'cap-list-view',
	template:`
		<table style="width:100%">
		  <thead>
		  	<tr>
			    <th>Cap ID</th>
			    <th>Level</th>
			    <th>Customer</th>
			    <th>Age</th>
		    </tr>
		  </thead>
		  <tbody>
			  <tr *ngFor="let m of model ">
			    <td>{{m.caseNumber}}</td>
			    <td>{{correctName(m.capLevel)}}</td>
			    <td>{{m.customer}}</td>
			    <td>{{m.age}}</td>
			  </tr>
		  </tbody>
		</table>
	`
})
export class CapListView  {
	public _model:any = [];

	@Input()
	set model(model){   // model.sort belwo will provide a sorting logic for alphabets
		this._model = model.sort(function(a, b) {
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
});


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
