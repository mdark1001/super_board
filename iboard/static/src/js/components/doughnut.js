/** @odoo-module **/


import {iBoardBase} from "./base";
import {doughnutLabel} from "./plugins";


export class Doughnut extends iBoardBase {
    constructor(element, data, colors) {
        super(data, colors);
        this.el = element.el
        this.chartSelextor = d3.select(this.el)
            .append("canvas")
            .attr("id", "canvas_" + this.data.id)
            .attr("width", this.getWidth())
            .attr("height", this.getHeight())
    }

    draw() {
        super.draw();
        const data = this.getDataChart()

        const ctx = document.getElementById("canvas_" + this.data.id);
        this.chartObj = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: data.datasets,
            },
            options: this.getChartOptions(),
            plugins: this.getPlugins()
        });

    }

    redraw(data,) {
        super.redraw(data);
        d3.select("#canvas_" + this.data.id).html('')
        this.draw()
    }

    getDataChart() {
        let {datasets, labels} = super.getDataChart()
        datasets[0]['backgroundColor'] = [];
        for (let i = 0; i < labels.length; i++) {
            datasets[0]['backgroundColor'].push(this.getPaletteItem(i))
        }
        return {datasets, labels}
    }

    getPlugins() {
        let plugins = super.getPlugins()
        if (this.data.config.showTotal) {
            plugins.push(doughnutLabel)
        }
        return plugins
    }

}