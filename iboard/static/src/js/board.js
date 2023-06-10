/** @odoo-module **/
/**
 * @author: Miguel Cabrera Ramírez
 * @date: 15/03/2023
 * */
import {registry} from "@web/core/registry";
import {useBus, useService} from "@web/core/utils/hooks";
import {loadAssets} from "@web/core/assets";
import {ChartFactory} from "./components/chart_factory";

const {Component, useState, core, hooks} = owl;

const {EventBus} = core;
const {useRef, useExternalListener} = hooks;

function useMouse(state) {
    const grid = GridStack.init()

    grid.on('resizestop', function (event, el) {
        console.log(event);
        console.log(el);
        let charID = event.target.dataset.id;

    });
    /*
        onWillDestroy(() => {
            window.removeEventListener('mousemove', update);
        });
    */

    return grid;
}

class Board extends Component {
    setup() {
        super.setup();

        let boardID = 1 // this.props.action.params?.board_id || this.props.action.params?.active_id
        this.state = useState({
            'boardID': boardID,
            'charts': [],
            'boardName': "",
        })
        this.orm = useService('orm')
        this.assets = {
            jsLibs: [
                "https://d3js.org/d3.v7.min.js",
                // "/iboard/static/src/js/libs/node_modules/gridstack/dist/es5/gridstack-all.js",
            ],
            cssLibs: [
                //"/iboard/static/src/js/libs/node_modules/gridstack/dist/gridstack.min.css",
            ],
        };


    }

    async willStart() {
        super.willStart();
        await loadAssets(this.assets);
        let charts = await this.callGetChartsFromDashboard();
        console.log(charts);
        this.state.boardName = charts.name
        this.state.charts = charts.chart_ids
        this.grid = false;
    }

    mounted() {
        super.mounted();
        //GridStack.init()
        this.startGrid()
    }

    startGrid() {
        setTimeout(() => {
              //  this.mouse = useMouse(this.state)
            }, 1000
        )

    }

    _onResize(event, ui) {
        console.log(event);
    }

    callGetChartsFromDashboard() {
        return this.orm.call(
            'iboard.board',
            'get_charts',
            [],
            {
                'board_id': this.state.boardID,
            }
        )
    }
}

Board.bus = new EventBus()
Board.template = 'iboard.Board'
Board.components = {
    ChartFactory
}

registry.category("actions").add("iboard_build", Board);