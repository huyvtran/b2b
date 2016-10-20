import { Component, Input }        from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
    selector: 'pie-chart',
    directives: [CHART_DIRECTIVES],
    template: '<chart style="width:100%;height:178px" [options]="options"></chart>'
})
export class PieChart {
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

    renderChart() {
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
                marginBottom:0
            },
            series: [{
                type:'pie',
                colorByPoint: true,
                data: this.dataProvider
            }],
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        formatter:function(){
                            let str = this.point.name;
                            if(str.length>8){
                                str = str.match(/\b([A-Z])/g).join('');
                            }
                            return '<em>'+this.point.y+'</em>';
                        },
                        distance: 8,
                        style: { fontFamily: '\'Lato\', sans-serif', lineHeight: '16px', fontSize: '14px', fontWeight:'normal' }
                    },
                    showInLegend: true
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                useHTML:true,
                labelFormatter: function() {
                  //let label = this.name.length>8?this.name.match(/\b([A-Z])/g).join(''):this.name;
                  let label = this.name.length > 15 ? this.name.slice(0, 15)+"..." : this.name;
                  return label;
                }
            }
        };
    }
    options: Object;
}
