/** @odoo-module */

export class iBoardBase {
    data = {}
    colors = []
    _factorDeviceSize = 1

    constructor(data, colors) {
        this.data = data
        this.colors = colors(data?.palette_id?.id)
    }

    draw() {

    }

    redraw(data) {
        this.data = data
    }

    getDataChart() {
        return JSON.parse(JSON.stringify(this.data.data))
    }

    getPaletteItem(index) {
        return this.colors[index % this.colors.length];
    }

    getChartOptions() {
        return {
            responsive: false,
            plugins: {
                legend: {
                    position: this.data.legend_position // place legend on the right side of chart
                },
            }
        }
    }

    getPlugins() {
        return []
    }

    getWidth() {
        return parseInt(this.data.config.width) * this._factorDeviceSize
    }

    getHeight() {
        return parseInt(this.data.config.height) * this._factorDeviceSize
    }

}