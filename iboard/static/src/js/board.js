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


class Board extends Component {
    async setup() {
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
                '/iboard/static/src/js/lib/js/Chart.bundle.min.js',
                '/iboard/static/src/js/lib/js/pdfmake.min.js',
                '/iboard/static/src/js/lib/js/vfs_fonts.js',
            ],
            cssLibs: [],
        };
        await loadAssets(this.assets);


    }

    async willStart() {
        super.willStart();
        let charts = await this.callGetChartsFromDashboard();
        console.log(charts);
        this.state.boardName = charts.name
        this.state.charts = charts.chart_ids
    }

    mounted() {
        super.mounted();
        //GridStack.init()
        this.startGrid()
    }

    startGrid() {
        //console.log(this);
        setTimeout(() => {
       //         GridStack.init()
            }, 1000
        )

    }

    _onResize(event,ui) {
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