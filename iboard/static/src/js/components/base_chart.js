/** @odoo-module **/



const {Component, useState} = owl;
const {onWillUpdateProps} = owl.hooks
import {useService} from "@web/core/utils/hooks";

const {EventBus} = owl.core;



const {useExternalListener} = owl.hooks;

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
        this.actionService = useService("action");
        this.colors = this.props.colors(this.props.chart?.palette_id?.id)
        onWillUpdateProps(nextProps => {
            this.redrawSize()
        });
        this.state = useState({
            'chartID': this.setChartID(),

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

    setChartID() {
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
        let d = this.props.chart.data.datasets;
        if (this.props.chart.config.filter_empty) {
            d = d.filter(d => d.value > 0)
        }
        return d
    }

    editChart(event) {
        event.preventDefault()
        this.actionService.doAction({
            name: 'Crear grupos',
            res_model: 'iboard.chart',
            res_id: this.props.chart.id,
            context: {
                'default_id': this.props.chart.id
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

iboardBaseChart.template = 'iboard.BaseChart'
iboardBaseChart.bus = new EventBus()