/** @odoo-module **/


import {iBoardBase} from "./base";
import {doughnutLabel} from "./plugins";


export class Doughnut extends iBoardBase {
    constructor(element, data, colors) {
        super(data, colors);
        this.el = element.el
    }

    draw() {
        super.draw();
        this.chartSelextor = d3.select(this.el)
            .append("canvas")
            .attr("id", "canvas_" + this.data.id)
            .attr("width", this.getWidth())
            .attr("height", this.getHeight())
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



    resizeChart() {
        this.chartObj.canvas.width = this.getWidth()
        this.chartObj.canvas.height = this.getHeight() * .7
        this.chartObj.resize()
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