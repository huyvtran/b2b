import { Component, Input }        from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts'; 

@Component({
    selector: 'multi-chart',
    directives: [CHART_DIRECTIVES],    
    template: '<chart style="width:100%;height:150px" [options]="options"></chart>'
})
export class MultiSeriesChart {

	private _data=[];

	@Input()
	set dataProvider(data){		
		this._data = data;
		if(this.dataProvider.length){
			this.renderChart();
		}
	}

	get dataProvider(){
		return this._data;
	}
    constructor() {    	
    	if(this.dataProvider.length){
    		this.renderChart();
    	}
    }
    options: Object;

    prepareChartData(data){    	    	
    	var object={
    		xAxis:[],
    		Incoming:[],
    		Open:[]
    	}
    	for (let i = 0; i < data.length; i++) {
    		if(object['xAxis'].indexOf(data[i].date)==-1){
    			object['xAxis'].push(data[i].date);	
    		}
    		object[data[i].trendType] && object[data[i].trendType].push(data[i].value);
    	}
		return object;
    }

    renderChart(){    	
    	var obj = this.prepareChartData(this.dataProvider);
    	this.options = {
        	credits: {
		        enabled: false
		    },
	        chart: {
	            zoomType: 'xy',
	            backgroundColor:'#f2f3f2'
	        },
	        title: {
	        	text: '',
			    style: {
			        display: 'none'
			    }
	        },	        
	        xAxis: {
	            categories: obj.xAxis,
	            tickInterval:2
	        },
	        yAxis: [{ // Primary yAxis            
	            title: {
	                text: 'Incoming'
	            }
	        }, { // Secondary yAxis
	            title: {
	                text: 'Open'
	            },
	            opposite: true
	        }],
	        tooltip: {
	            shared: true
	        },        
	        series: [{
	            name: 'Incoming',
	            type: 'column',             
	            color: 'orange',
	            data: obj.Incoming

	        }, {
	            name: 'Open',
	            type: 'spline',
	            color: '#009edc',           
	            data: obj.Open,
	            yAxis: 1,
	            marker: {
                    enabled: false
                }          
	        }],
	        legend: {	            
	            verticalAlign: 'top'
	        },
	        plotOptions: {
	            series: {
	                pointWidth: 10
	            }
	        }
        };
    }
}