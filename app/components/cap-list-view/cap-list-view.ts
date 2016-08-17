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
			  <tr *ngFor="let m of model">
			    <td>{{m.capId}}</td>
			    <td>{{m.level}}</td>
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
	set model(model){
		this._model = model;
	};
	get model(){
		return this._model;
	};
}