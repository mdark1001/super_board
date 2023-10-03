/** @odoo-module **/

import {iBoardBase} from "./base";


export class Bars extends iBoardBase {
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

    resizeChart() {
        this.chartObj.canvas.width = this.getWidth()
        this.chartObj.canvas.height = this.getHeight() * .7
        this.chartObj.resize()
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