/** @odoo-module **/


import {iboardBaseChart} from "./base_chart";

export class iboardPieChart extends iboardBaseChart {
    chartType = 'doughnut'

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
        console.log(selector);
        let chart = new Chart(selector, this.config)
        chart.canvas.parentNode.style.height = this.chartConfig.height;
        chart.canvas.parentNode.style.width = this.chartConfig.width;

    }

}
