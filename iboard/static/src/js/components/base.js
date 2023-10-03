/** @odoo-module */

export class iBoardBase {
    data = {}
    colors = []
    _factorDeviceSize = 1
    groups = undefined

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
        let data = JSON.parse(JSON.stringify(this.data.data))
        this.key = data.config.key
        this.groups = data.config.groups
        if (this.data.order_by === 'asc') {
            data.datasets.sort((itemA, itemB) => itemA[this.key] - itemB[this.key])
        } else if (this.data.order_by === 'desc') {
            data.datasets.sort((itemA, itemB) => itemB[this.key] - itemA[this.key])
        }
        let group1 = this.getFirstSubgroup()
        let labels = this.getUniqueLabels(data.datasets, group1)
        let datasets = this.getDatasets(data.datasets, labels)

        return {datasets: datasets, labels: labels}
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

    getDatasets(datasets, labels) {
        let _datasets = []
        let index = 0
        if (!this.hasSubgroup()) {
            _datasets.push({
                    "label": this.data.legend_name,
                    "data": datasets.map(i => i[this.key]),
                    "borderWidth": 1,
                    "backgroundColor": this.getPaletteItem(index)
                }
            )
        } else {
            let _records = false
            let first = this.groups[0]
            let second = this.groups[1]
            let uniqueDatasets = this.getUniqueLabels(datasets, second)
            for (let _se of uniqueDatasets) {
                _datasets.push({
                        "label": _se,
                        "data": [],
                        "borderWidth": 1,
                        "backgroundColor": this.getPaletteItem(index)
                    }
                )
                for (let label of labels) {
                    _records = datasets.filter(item => {
                        return item[second] === _se
                            && item[first] === label;
                    })
                    console.log(_records);
                    if (_records.length) {
                        _datasets[index].data.push(_records[0][this.key])
                    } else {
                        _datasets[index].data.push(0)
                    }
                }
                index++
            }
        }
        return _datasets
    }


    getPlugins() {
        return []
    }


    getWidth() {
        return this.el.closest("div.grid-stack-item").clientWidth * .9
    }

    getHeight() {
        return this.el.closest("div.grid-stack-item").clientHeight * .8
    }

    orderDatasets(datasets, labels) {
        console.log(datasets);
        console.log(labels);
    }

    hasSubgroup() {
        return typeof (this.groups) != 'string'
    }

    getFirstSubgroup() {
        return (this.hasSubgroup() ? this.groups[0] : this.groups)
    }

    getUniqueLabels(datasets, key) {
        return Array.from(new Set(datasets.map(item => item[key])).values())
    }
}