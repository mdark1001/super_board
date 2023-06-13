/** @odoo-module **/


import {iboardPieChart} from "./pie_chart";
import {iboardBarChart} from "./bar_chart";
import {iboardTitle} from "./title_chart";

const {Component} = owl;

export class ChartFactory extends Component {
    ChartMAp = {}
    setup() {
        super.setup();

    }

    get getChart() {
        if (this.props.chart.chart_type === 'title')
            return iboardTitle
        if (this.props.chart.chart_type === 'pie')
            return iboardPieChart
        if (this.props.chart.chart_type === 'bar')
            return iboardBarChart
    }
}

ChartFactory.template = 'iboard.ChartFactory'