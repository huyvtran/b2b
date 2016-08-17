import { Component }        from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts'; 

@Component({
    selector: 'pie-chart',
    directives: [CHART_DIRECTIVES],    
    template: '<chart style="width:80%;height:200px" [options]="options"></chart>'
})
export class PieChart {
    constructor() {
        this.options = {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            subtitle : { text : 'Level' },
            credits: {
                enabled: false
            },
            chart:{
                backgroundColor:'#f2f3f2',               
                marginBottom:-10
            },
            series: [{
                type:'pie',
                data: [{name:"A", y: 65},{name:"B", y: 60},{name:"M", y: 15}],
            }],
            plotOptions: {
                pie: {                    
                    dataLabels: {
                        enabled: true,
                        format: "<span>{point.name}</span><br><em>{point.y}</em>",
                        distance: -20,                        
                        style: { fontFamily: '\'Lato\', sans-serif', lineHeight: '18px', fontSize: '17px', fontWeight:'normal' }
                    },
                    showInLegend: true
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                floating: false
            }
        };
    }
    options: Object;
}