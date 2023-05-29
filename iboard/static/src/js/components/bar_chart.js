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
        this.setChartConfiguration()
    }

    mounted() {
        super.mounted();
        this.chartID = 'chart_' + this.props.chart.id
        let selector = document.getElementById(this.chartID)
        new Chart(selector, this.config)
    }

}
