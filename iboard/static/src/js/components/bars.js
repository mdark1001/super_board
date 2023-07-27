/** @odoo-module **/

import {iBoardBase} from "./base";

export class Bars extends iBoardBase {
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
        console.log(data);
        const ctx = document.getElementById("canvas_" + this.data.id);
        this.chartObj = new Chart(ctx, {
            type: 'bar',
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
        return super.getDataChart()
    }

    getChartOptions() {
        let config = super.getChartOptions()
        config.scales = {
            x: {
                stacked: this.data.stacked // this should be set to make the bars stacked
            },
            y: {
                stacked: this.data.stacked  // this also..
            }
        }
        if (this.data.bar_orientation !== 'vertical') {
            config['indexAxis'] = 'y'
        }
        return config
    }

}