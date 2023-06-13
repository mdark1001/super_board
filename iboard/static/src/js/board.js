/** @odoo-module **/
/**
 * @author: Miguel Cabrera Ramírez
 * @date: 15/03/2023
 * */
import {registry} from "@web/core/registry";
import {useBus, useService} from "@web/core/utils/hooks";
import {loadAssets} from "@web/core/assets";
import {ChartFactory} from "./components/chart_factory";



const {Component, useState, core, hooks, reactive} = owl;
const {EventBus} = core;

class Board extends Component {
    async setup() {
        super.setup();
        let boardID = 2 // this.props.action.params?.board_id || this.props.action.params?.active_id
        this.state = useState({
            'boardID': boardID,
            'charts': [],
            'boardName': "",
        })
        this.orm = useService('orm')
        this.assets = {
            jsLibs: [
                "https://d3js.org/d3.v7.min.js",
                "/iboard/static/src/js/node_modules/gridstack/dist/es5/gridstack-all.js",
            ],
            cssLibs: [
                "/iboard/static/src/js/node_modules/gridstack/dist/gridstack.min.css",
                "/iboard/static/src/css/dashboard_gridstack.css",
            ],
        };
        await loadAssets(this.assets);
        this.charts = hooks.useRef('chart')
    }

    async willStart() {
        await super.willStart();
        let charts = await this.callGetChartsFromDashboard();
        console.log(charts);
        this.state.boardName = charts.name
        this.state.charts = charts.chart_ids
    }

    mounted() {
        super.mounted();
        this.startGrid()
    }

    startGrid() {
        this.grid = GridStack.init()
        this.grid.on('resizestop', (e, u) => {
            let chartID = parseInt(e.target.id);
            let index = this.state.charts.findIndex(item => item.id === chartID)
            let width = u.gridstackNode.el.offsetWidth;
            let height = u.gridstackNode.el.offsetHeight;
            this.state.charts[index].config.width = width + 'px';
            this.state.charts[index].config.width = height + 'px';
            let id = Object.keys(this.charts.comp.__owl__.children)
            console.log( this.charts.comp.__owl__.children[id[0]]);
            this.charts.comp.__owl__.children[id[0]].redrawSize(width,height)

        })
    }

    callGetChartsFromDashboard() {
        return this.orm.call(
            'iboard.board',
            'get_charts',
            [],
            {
                'board_id': this.state.boardID,
            }
        ).then(res => {
            console.log(res);
            for (let item in res.chart_ids) {
                res.chart_ids[item].data = JSON.parse(res.chart_ids[item].preview)
                res.chart_ids[item].config = JSON.parse(res.chart_ids[item].config)
            }
            return res
        })
    }
}

Board.bus = new EventBus()
Board.template = 'iboard.Board'
Board.components = {
    ChartFactory
}

//


registry.category("actions").add("iboard_build", Board);