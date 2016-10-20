import {beforeEachProviders, it, describe, expect, inject} from '@angular/core/testing';
import {CapListView} from './cap-list-view';
describe('SwitchViewContainer component', () => { 	
	let a:CapListView = new CapListView();
	a.model = "aa"
    it('selectedView should be equal to list', () => { 		
        expect(a.model).toBe("aa");
    }); 
});