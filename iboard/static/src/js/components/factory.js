/** @odoo-module **/
/*
* @author: Miguel Cabrera
* */


const {Component, onMounted, useRef, onWillUpdateProps} = owl;
import {useService} from "@web/core/utils/hooks";
import {Title} from "./title";
import {Doughnut} from "./doughnut";
import {Bars} from "./bars";
import {TreeMap} from "./tree-map";
import { Maps} from './maps.js'

export class FactoryChart extends Component {
    _factory = {}

    setup() {
        this.actionService = useService("action");
        this.element = useRef('element')
        onMounted(this.mounted)
        onWillUpdateProps(this.redraw)
    }

    mounted() {
        this.setChartConfig()
        this.draw()
    }

    redraw(nextPros) {
        console.log(this);
        this.props = nextPros
        this._factory.redraw(this.props)
    }

    setChartConfig() {
        if (this.props.chart.chart_type === 'title')
            this._factory = new Title(
                this.element,
                this.props.chart,
                this.props.colors
            )
        if (this.props.chart.chart_type === 'pie')
            this._factory = new Doughnut(
                this.element,
                this.props.chart,
                this.props.colors
            )

        if (this.props.chart.chart_type === 'bar')
            this._factory = new Bars(
                this.element,
                this.props.chart,
                this.props.colors
            )
        if (this.props.chart.chart_type === 'tree')
            this._factory = new TreeMap(
                this.element,
                this.props.chart,
                this.props.colors,
            )
        if (this.props.chart.chart_type === 'map')
            this._factory = new Maps(
                this.element,
                this.props.chart,
                this.props.colors,
            )

    }

    draw() {
        this._factory.draw()
    }

    editChart(ev) {
        ev.preventDefault()
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

FactoryChart.template = 'iboard.FactoryChar'
