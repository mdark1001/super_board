/** @odoo-module **/


import {iboardBaseChart} from "./base_chart";

export class iboardBarChart extends iboardBaseChart {
    chartType = 'bar'

    setup() {
        super.setup();
        this.chartID = 'chart_' + this.props.chart.id
    }

    async willStart() {
        super.willStart();
    }

    mounted() {
        super.mounted();
    }

}
