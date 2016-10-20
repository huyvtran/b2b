import {Component, Input} from '@angular/core';
import {NavParams} from 'ionic-angular';

@Component({
	selector:'generic-list-view',
	template:`
		<table style="width:100%">
		  <thead>
		  	<tr>
			    <th>Type</th>
			    <th>SubType</th>
			    <th>Value</th>
		    </tr>
		  </thead>
		  <tbody>
			  <tr *ngFor="let m of model">
			    <td>{{m.type}}</td>
			    <td>{{correctName(m.subType)}}</td>
			    <td>{{m.value}}</td>
			  </tr>
		  </tbody>
		</table>
	`
})
export class GenericListView  {
	public _model:any = [];

	@Input()
	set model(model){   // model.sort belwo will provide a sorting logic for alphabets
			this._model = model.sort(function(a, b) {
			  var nameA = a.subType.toUpperCase(); // ignore upper and lowercase
			  var nameB = b.subType.toUpperCase(); // ignore upper and lowercase
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
