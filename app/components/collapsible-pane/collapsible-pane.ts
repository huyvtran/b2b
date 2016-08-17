import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector:'collapsible-pane',
	template:`
		<ion-item class="menu-collapsible" (click)="headerClicked();">
		    <ng-content select=".collapsible-pane-title"></ng-content>
		    <span [hidden]="disableCollapsible">
		    	<ion-icon name="arrow-dropright" [hidden]="!collapsed"></ion-icon>
		    	<ion-icon name="arrow-dropdown" [hidden]="collapsed"></ion-icon>
		    </span>
		</ion-item>
		<div [ngClass]="{close:collapsed}">
			<div class="wrraper-container"><ng-content select=".collapsible-pane-content"></ng-content></div>		    
		</div>
	`
})
export class CollapsiblePane  {
	private _collapsed:Boolean = false;
	private _disableCollapsible:Boolean;

	@Output() headerTapped = new EventEmitter();

	@Input()
	set disableCollapsible(disableCollapsible){
		this._disableCollapsible = disableCollapsible
	}

	get disableCollapsible(){
		return this._disableCollapsible;
	}

	@Input()
	set collapsed(collapse){
		this._collapsed = collapse
	}

	get collapsed(){
		return this._collapsed;
	}

	headerClicked(){
		this.headerTapped.emit({});
				
		if(this.disableCollapsible){
			return;
		}
		this._collapsed=!this._collapsed
	}
}