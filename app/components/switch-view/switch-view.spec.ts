import {beforeEachProviders, it, describe, expect, inject} from '@angular/core/testing';
import {SwitchViewContainer} from './switch-view';
describe('SwitchViewContainer component', () => { 	
	let a:SwitchViewContainer = new SwitchViewContainer();
    it('selectedView should be equal to list', () => { 		
        expect(a.selectedView).toBe("list"); 
    }); 
});