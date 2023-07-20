/** @odoo-module **/
import {iboarColors} from "./components/helpers";

/**
 * @author: Miguel Cabrera Ramírez
 * @date: 15/03/2023
 * */
const {Component, onWillStart, onMounted, onWillRender, useState} = owl;
import {useSetupAction} from "@web/webclient/actions/action_hook";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {loadCSS, loadJS} from "@web/core/assets";
import {BOARD_MODEL} from "./common";
import {ChartFactory} from "./components/chart_factory";

export class iBoardAction extends Component {
    setup() {
        super.setup()
        useSetupAction();
        this.orm = useService('orm')
        this.ui = useService("ui")
        this.actionService = useService("action");
        this.editedChartSize = [];
        this.boardID = 1 // this.props.action.params?.board_id || this.props.action.params?.active_id
        this.state = useState({
            'boardID': this.boardID,
            'charts': [],
            'boardName': "",
            'gridConfig': undefined,
            'staticGrid': true,
        })

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
        onWillStart(this.willStart)
        onMounted(this.mounted)
    }

    async willStart() {
        for (const item of this.assets.jsLibs) {
            await loadJS(item);
        }
        for (const item of this.assets.cssLibs) {
            await loadCSS(item);
        }
        let charts = await this.callGetChartsFromDashboard();
        this.state.boardName = charts.name
        this.state.charts = charts.chart_ids
        this.state.colors = iboarColors(charts.palettes)
        this.state.gridConfig = JSON.parse(charts.layout)
    }

    mounted() {
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
        if (this.grid)
            this.grid.setStatic(this.state.staticGrid)
    }

    editLayoutSave(ev) {
        ev.preventDefault()
        this.state.staticGrid = true
        if (this.grid) {
            this.grid.setStatic(this.state.staticGrid)
            this.callServiceSaveLayout()
        }
    }

    addChart(ev) {
        ev.preventDefault()
        this.actionService.doAction({
            name: 'Agregar gráfica',
            res_model: 'iboard.chart',
            context: {
                'default_board_id': this.state.boardID,
                'board_id': this.state.boardID,
            },
            views: [[false, 'form']],
            type: "ir.actions.act_window",
            view_mode: "form",
            target: "new",
        }, {
            onClose: () => {
                window.location.reload()
            }
        });
    }

    /**
     * Call services
     * */
    callGetChartsFromDashboard() {
        console.log(BOARD_MODEL);
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

iBoardAction.template = 'iboard.Board'
iBoardAction.components = {
    ChartFactory
}
registry.category("actions").add('iboard_action', iBoardAction)


