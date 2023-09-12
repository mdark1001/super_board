/** @odoo-module **/

import {iBoardBase} from "./base";

function calculateContainerWidth() {
    // You can adjust this logic as needed based on your layout
    const maxWidth = document.documentElement.clientWidth - 30; // Subtracting 20px for some padding or margin
    const containerWidth = Math.min(maxWidth, 600); // Limit to a maximum width if needed
    return containerWidth;
}

export class Bars extends iBoardBase {
    constructor(element, data, colors) {
        super(data, colors);
        this.el = element.el
        this.setParentWidth()
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

    setParentWidth() {
        let _width = calculateContainerWidth()
        this.data.config.width = _width + "px"
    }

}