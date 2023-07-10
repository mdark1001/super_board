/** @odoo-module **/


import {iboardBarChart} from "./bar_chart";
import {iboardTitle} from "./title_chart";
import {iboardDoughnutChart} from "./doughnut";
import {iBoardTreeMap} from "./tree-map";

const {Component} = owl;

export class ChartFactory extends Component {
    ChartMAp = {}

    setup() {
        super.setup();

    }

    get getChart() {
        console.log(this.props.chart.chart_type);
        if (this.props.chart.chart_type === 'title')
            return iboardTitle
        if (this.props.chart.chart_type === 'pie')
            return iboardDoughnutChart
        if (this.props.chart.chart_type === 'bar')
            return iboardBarChart
        if (this.props.chart.chart_type === 'tree')
            return iBoardTreeMap
    }
}

ChartFactory.template = 'iboard.ChartFactory'