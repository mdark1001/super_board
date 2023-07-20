/** @odoo-module **/



const {Component, useState,onWillUpdateProps} = owl;
import {useService} from "@web/core/utils/hooks";

//const {EventBus} = owl.core;


class GenericContainerBaseChart extends Component {
    static template = 'GenericContainerBaseChart'

    setup() {
        super.setup();
        this.actionService = useService("action");
    }

    editChart(event) {
        event.preventDefault()
        this.actionService.doAction({
            name: 'Crear grupos',
            res_model: 'iboard.chart',
            res_id: this.props.slots.chart.id,
            context: {
                'default_id': this.props.slots.chart.id
            },
            views: [[false, 'form']],
            type: "ir.actions.act_window",
            view_mode: "form",
            target: "new",
        }, {
            onClose: () => {

            }
        });
    }
}

export class iboardBaseChart extends Component {
    options = {}
    chartID = ''
    chartType = ''
    _factorDeviceSize = .8
    static props = {
        chart: {
            type: Object
        },
        layout: {
            type: Object
        },
        colors: {
            type: 'function',
        }
    }

    setup() {
        super.setup();

        this.colors = this.props.colors(this.props.chart?.palette_id?.id)
        onWillUpdateProps(nextProps => {
            this.redrawSize()
        });
        this.state = useState({
            'chartID': this.getChartID(),
        })
    }

    mounted() {
        super.mounted();
    }

    /**
     * @param factor {number}
     * */
    setFactorDeviceSize(factor) {
        this._factorDeviceSize = factor
    }

    getChartID() {
        return 'chart_' + this.props.chart.id
    }

    redrawSize() {
        d3.select("#" + this.state.chartID).html("");
        d3.select("div#chart_body_" + this.props.chart.id).html("")
        this.draw()
    }

    draw() {

    }

    getWidth() {
        return parseInt(this.props.chart.config.width) * this._factorDeviceSize
    }

    getHeight() {
        return parseInt(this.props.chart.config.height) * this._factorDeviceSize
    }

    getDataChart() {
        // To avoid recursión on data observable,
        // we destroy the object and create new one
        return JSON.parse(JSON.stringify(this.props.chart.data));
    }

    getSVGSelector() {
        return d3.select("#" + this.state.chartID)
    }

    startSVG(width, height, pos_x, pos_y) {
        return this.getSVGSelector()
            .attr("viewBox", "0 0 600 400")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append("g")
            .attr("transform", "translate(" + pos_x + "," + pos_y + ")");

    }

    getPaletteItem(index) {
        return this.colors[index % this.colors.length];
    }

     getChartOptions() {
        let config = {
            responsive: true,
            legend: {
                position: this.props.chart.legend_position // place legend on the right side of chart
            },
        }

        return config
    }


}

iboardBaseChart.template = 'iboard.BaseChart'
//iboardBaseChart.bus = new EventBus()
iboardBaseChart.components = {
    GenericContainerBaseChart
}