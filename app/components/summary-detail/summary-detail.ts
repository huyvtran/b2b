import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'summary-detail',
  templateUrl: 'build/components/summary-detail/summary-detail.html'
})
export class SummaryDetail {

  	public _model:Object;	
  	public currentIndex = 0;

  	@Output()selectionChanged = new EventEmitter();

	@Input()
	set model(model: Object) {		
	    this._model = model || {};
	}
	get model() { 
		return this._model; 
	}
	next(){
		if(this.currentIndex + 1 == this.model['subCategories'].length){
			return;
		}		
		this.currentIndex++;
		this.selectionChanged.emit({
      		value: this.currentIndex
    	})
	}

	prev(){
		if(this.currentIndex){
			this.currentIndex--;
			this.selectionChanged.emit({
	      		value: this.currentIndex
	    	})
		}		
	}
}
