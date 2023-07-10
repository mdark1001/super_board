/** @odoo-module **/

const {Component} = owl;
import {iboardBaseChart, iboardColorsTitle} from "./base_chart";

export class iboardTitle extends iboardBaseChart {
    chartType = 'title'

    setup() {
        super.setup();
        this.chartID = 'chart_' + this.props.chart.id
        if (this.props.chart.title_design === 'd0')
            this.props.chart.palette = undefined
        this.colors = ''

    }

    async willStart() {
        super.willStart();
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
