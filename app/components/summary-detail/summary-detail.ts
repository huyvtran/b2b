import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'summary-detail',
  templateUrl: 'build/components/summary-detail/summary-detail.html'
})
export class SummaryDetail {

  	private _model:Object;	
  	private _currentIndex = 0;

  	@Output()selectionChanged = new EventEmitter();

	@Input()
	set model(model: Object) {		
	    this._model = model || {};
	}
	get model() { 
		return this._model; 
	}
	
	@Input()
	set currentIndex(index:number) {		
	    this._currentIndex = index || 0;
	}
	get currentIndex() { 
		return this._currentIndex; 
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
