import {Component} from '@angular/core';

@Component({
	selector:'switch-view',
	template:`
		<div style="text-align:right;">
            <span (click)="selectedView='list'" [ngClass]="{'view-icon-active':selectedView=='list'}" class="view-icon view-icon-active"><ion-icon name="list"></ion-icon></span>
            <span (click)="selectedView='chart'" [ngClass]="{'view-icon-active':selectedView=='chart'}" class="view-icon"><ion-icon name="stats"></ion-icon></span>
    </div>
    <div *ngIf="selectedView=='chart'"><ng-content select=".chart-view"></ng-content></div>
    <div *ngIf="selectedView=='list'"><ng-content select=".list-view"></ng-content></div>
	`
})
export class SwitchViewContainer  {
	public selectedView = 'list';
}
