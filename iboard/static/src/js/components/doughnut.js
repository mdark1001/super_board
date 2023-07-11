/** @odoo-module **/
import {iboardBaseChart} from "./base_chart";
import {doughnutLabel} from "./plugins";

export class iboardDoughnutChart extends iboardBaseChart {
    chartType = 'bar'

    setup() {
        super.setup();
        console.log(this);

    }

    async willStart() {
        super.willStart();
    }

    mounted() {
        super.mounted();
        this.setFactorDeviceSize(1)
        this.draw()
    }

    redrawSize() {
        this.chartObj.update()
    }

    draw() {
        super.draw();
        let w = this.getWidth()
        let h = this.getHeight()
        this.data = this.getDataChart()
        const ctx = document.getElementById(this.getChartID());
        this.chartObj = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.labels,
                datasets: this.data.datasets,
            },
            options: this.getChartOptions(),
            plugins: this.getPlugins()
        });

        //  this.chartObj.canvas.parentNode.style.height = h + 'px';
        //    this.chartObj.canvas.parentNode.style.width = w + 'px';
    }

    getChartID() {
        return 'chart_canvas_' + this.props.chart.id
    }

    getDataChart() {
        let {datasets, labels} = super.getDataChart()
        datasets[0]['backgroundColor'] = [];
        for (let i = 0; i < labels.length; i++)
            datasets[0]['backgroundColor'].push(this.getPaletteItem(i))
        return {datasets, labels}
    }



    getPlugins() {
        let plugins = []
        if (this.props.chart.config.showTotal) {
            plugins.push(doughnutLabel)
        }
        return plugins
    }

}

iboardDoughnutChart.template = 'iboard.ChartJS';