/** @odoo-module **/
/**
 * @author: Miguel Cabrera Ramírez
 * @date: 15/03/2023
 * */
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {loadAssets} from "@web/core/assets";
import {ChartFactory} from "./components/chart_factory";
import {BOARD_MODEL} from "./common";
import {iboarColors} from "./components/helpers";

const {Component, useState, core, hooks, reactive} = owl;
const {EventBus} = core;

class Board extends Component {
    async setup() {
        super.setup();
        this.editedChartSize = [];
        let boardID = 3 // this.props.action.params?.board_id || this.props.action.params?.active_id
        this.state = useState({
            'boardID': boardID,
            'charts': [],
            'boardName': "",
            'gridConfig': undefined,
            'staticGrid': true,
        })
        this.orm = useService('orm')
        this.assets = {
            jsLibs: [
                "https://d3js.org/d3.v7.min.js",
                "/iboard/static/src/js/node_modules/gridstack/dist/es5/gridstack-all.js",
                "https://cdn.jsdelivr.net/npm/chart.js",
            ],
            cssLibs: [
                "/iboard/static/src/js/node_modules/gridstack/dist/gridstack.min.css",
                "/iboard/static/src/js/node_modules/gridstack/dist/gridstack-extra.min.css",
                "/iboard/static/src/css/dashboard_gridstack.css"

            ],
        };
        await loadAssets(this.assets);

    }

    async willStart() {
        await super.willStart();
        let charts = await this.callGetChartsFromDashboard();
        this.state.boardName = charts.name
        this.state.charts = charts.chart_ids
        this.state.colors = iboarColors(charts.palettes)
        this.state.gridConfig = JSON.parse(charts.layout)
    }

    mounted() {
        super.mounted();
        this.startGrid()
    }

    startGrid() {
        this.grid = GridStack.init({
            disableResize: false,
            minRow: 10,
            staticGrid: this.state.staticGrid,
            float: false,
            animate: true,
            cellHeight: 160,
        })
        // this.grid.load(this.state.gridConfig)
        this.grid.on('dragstop', (event, el) => {
            let node = el.gridstackNode; // {x, y, width, height, id, ....}
            this.state.gridConfig[node.el.id.toString()] = {
                'x': node.x,
                'y': node.y,
                'id': node.el.id
            }
        });
        this.grid.on('resizestop', (event, el) => {
            let node = el.gridstackNode; // {x, y, width, height, id, ....}
            let chartID = parseInt(node.el.id)
            let chartIndex = this.state.charts.findIndex(elem => elem.id == chartID)
            this.state.charts[chartIndex].config.gsMinHeight = node.h;
            this.state.charts[chartIndex].config.gsMinWidth = node.w;
            this.state.charts[chartIndex].config.width = node.el.offsetWidth + 'px';
            this.state.charts[chartIndex].config.height = node.el.offsetHeight + 'px';
            this.editedChartSize.push({
                    chartID: chartID,
                    config: this.state.charts[chartIndex].config
                }
            )
        })

    }

    /*
    * User Events
    * */

    editLayout(ev) {
        ev.preventDefault()
        this.state.staticGrid = false
        this.grid.setStatic(this.state.staticGrid)
    }

    editLayoutSave() {
        this.state.staticGrid = true
        this.grid.setStatic(this.state.staticGrid)
        this.callServiceSaveLayout()
    }

    /**
     * Call services
     * */
    callGetChartsFromDashboard() {
        return this.orm.call(
            BOARD_MODEL,
            'get_charts',
            [],
            {
                'board_id': this.state.boardID,
            }
        ).then(res => {
            for (let item in res.chart_ids) {
                res.chart_ids[item].data = JSON.parse(res.chart_ids[item].preview)
                res.chart_ids[item].config = JSON.parse(res.chart_ids[item].config)
            }
            return res
        })
    }

    callServiceSaveLayout() {
        return this.orm.call(
            BOARD_MODEL,
            'save_layout',
            [],
            {
                'board_id': this.state.boardID,
                'layout': JSON.stringify(this.state.gridConfig),
                'charts_config': JSON.stringify(this.editedChartSize)
            }
        ).then(res => {
            this.editedChartSize = []
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