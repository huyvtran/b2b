import { Component, Input }        from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts'; 

@Component({
    selector: 'multi-chart',
    directives: [CHART_DIRECTIVES],    
    template: '<chart style="width:100%;height:150px" [options]="options"></chart>'
})
export class MultiSeriesChart {

	private _data=[];
	
	private getSeries = [
		{
			name: 'Incoming',
			type: 'column',             
			color: 'orange',
			data: Object

		},		
		{
			name: 'Open',
			type: 'spline',
			color: '#009edc',           
			data: Object,
			yAxis: 1,
			marker: {
				enabled: false
			}          
		}
	]
	private getYAxis = [{ // Primary yAxis            
		title: {
			text: 'Incoming'
		}
	}, { // Secondary yAxis
		title: {
			text: 'Open'
		},
		opposite: true
	}]
	private series=[];
	private yAxis = [];

	@Input()
	set dataProvider(data){		
		this._data = data;
		this.renderChart();
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
    	var object:any={xAxis:[]},
			seriesCounter=0;
    	for (let i = 0; i < data.length; i++) {
    		if(object['xAxis'] && object['xAxis'].indexOf(data[i].date)==-1){
    			object['xAxis'].push(data[i].date);	
    		}
    		if(!object[data[i].trendType]){
				object[data[i].trendType]=[];
				let _series = this.getSeries[seriesCounter];
				_series.name = data[i].trendType;
				_series.data = object[data[i].trendType];
				this.series.push(_series);
				let _yAxis = this.getYAxis[seriesCounter++];
				_yAxis.title.text = data[i].trendType;
				this.yAxis.push(_yAxis);
				if(seriesCounter == 2)seriesCounter = 1  
			}
			object[data[i].trendType].push(data[i].value);
    	}
		return object;
    }

    renderChart(){
		this.series = [];
		this.yAxis = [];
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
	        yAxis: this.yAxis,
	        tooltip: {
	            shared: true
	        },        
	        series: this.series,
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