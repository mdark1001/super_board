/** @odoo-module **/

const {Component} = owl;
import {iboardBaseChart, iboardColorsTitle} from "./base_chart";

export class iboardTitle extends iboardBaseChart {
    chartType = 'title'

    setup() {
        super.setup();
        console.log(this.props);
        this.chartID = 'chart_' + this.props.chart.id
        this.data = JSON.parse(this.props.chart.preview)
        if (this.props.chart.title_design === 'd0')
            this.props.chart.palette = undefined
        this.colors = iboardColorsTitle(this.props.chart?.palette)
        // todo agregar icons
        console.log(this.colors);

    }

    async willStart() {
        super.willStart();
        this.setChartConfiguration()
    }

    mounted() {
        super.mounted();
        this.chartID = 'chart_' + this.props.chart.id
    }

    getResize(event) {
        console.log(event);
    }

}

iboardTitle.template = 'iboard.Title2'
