import { Component }        from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
    selector: 'bar-chart',
    directives: [CHART_DIRECTIVES],
    template: '<chart style="width:100%;height:200px" [options]="options"></chart>'
})
export class BarChart {
    constructor() {
        this.options = {
        	credits: {
		        enabled: false
		    },
	        chart:{
	        	type: 'column',
                backgroundColor:'#f2f3f2'
            },
	        title: {
	        	text: '',
			    style: {
			        display: 'none'
			    }
	        },
	        xAxis: {
	            categories: ['2011', '2012', '2013', '2014', '2015'],
	            title: {
	                text: 'Creation Date'
	            }
	        },
	        yAxis: {
	            min: 0,
	            stackLabels: {
	                enabled: false,
	                style: {
	                    fontWeight: 'bold',
	                    color: 'gray'
	                }
	            }
	        },

	        tooltip: {
	            headerFormat: '<b>{point.x}</b><br/>',
	            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: false,
	                    color: 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: 'A',
	            data: [308,]
	        }, {
	            name: 'M',
	            data: [123,316]
	        }, {
	            name: 'B',
	            data: [5,63,14,172,14,321,144,33,97,11,293]
	        }, {
	            name: 'ME',
	            data: [175,718]
	        }


          ]
        };
    }
    options: Object;
}
