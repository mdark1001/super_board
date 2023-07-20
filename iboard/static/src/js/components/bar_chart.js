/** @odoo-module **/

const { onMounted} = owl;
import {iboardBaseChart} from "./base_chart";

export class iboardBarChart extends iboardBaseChart {
    chartType = 'bar'

    setup() {
        super.setup();
        onMounted(this.mounted)
    }

    async willStart() {
        super.willStart();
    }

    mounted() {
        // super.mounted();
        this.setFactorDeviceSize(1)
        this.draw()
    }

    redrawSize() {
        this.chartObj.destroy()
        this.draw()
    }


    draw() {
        super.draw();
        this.data = this.getDataChart()
        const ctx = document.getElementById(this.getChartID());
        this.chartObj = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.labels,
                datasets: this.data.datasets,
            },
            options: this.getChartOptions()
        });

        this.chartObj.resize()
    }

    getChartID() {
        return 'chart_canvas_' + this.props.chart.id
    }

    getDataChart() {
        let {datasets, labels} = super.getDataChart()
        for (let i = 0; i < datasets.length; i++)
            datasets[i].backgroundColor = this.getPaletteItem(i)
        return {datasets, labels}
    }

    getChartOptions() {
        let config = super.getChartOptions()
        config.scales = {
            xAxes: [{
                stacked: this.props.chart.stacked // this should be set to make the bars stacked
            }],
            yAxes: [{
                stacked: this.props.chart.stacked  // this also..
            }]
        }
        return config
    }
}

iboardBarChart.template = 'iboard.ChartJS'