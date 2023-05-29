/** @odoo-module **/


import {iboardBaseChart} from "./base_chart";

export class iboardTitle extends iboardBaseChart {
    chartType = 'title'

    setup() {
        super.setup();
        this.chartID = 'chart_' + this.props.chart.id
        this.data = JSON.parse(this.props.chart.preview)
    }

    async willStart() {
        super.willStart();
        // this.setChartConfiguration()
    }

    mounted() {
        super.mounted();
        this.chartID = 'chart_' + this.props.chart.id
        let selector = document.getElementById(this.chartID)
        // new Chart(selector, this.config)
    }

}

iboardTitle.template = 'iboard.Title'
