/** @odoo-module **/
import {iboardBaseChart} from "./base_chart";


function colorFromValue(value, border) {
    var alpha = (1 + Math.log(value)) / 5;
    var color = "purple";
    if (border) {
        alpha += 0.01;
    }
    return Chart.helpers.color(color)
        .alpha(alpha)
        .rgbString();
}

export class iBoardTreeMap extends iboardBaseChart {

    async setup() {
        super.setup();
        console.log(this.colors);
    }

    mounted() {
        super.mounted();
        this.draw()
    }

    redrawSize() {
        this.chartObj.destroy()
        this.draw()
        this.chartObj.resize()
    }

    getChartID() {
        return 'chart_canvas_' + this.props.chart.id;
    }

    draw() {
        super.draw();
        const ctx = document.getElementById(this.getChartID());
        ctx.setAttribute('width', '100%')
        let h = this.getHeight()
        ctx.setAttribute('height', h + 'ox')

        this.data = this.getDataChart()
        console.log(this.data);

        this.chartObj = new Chart(ctx.getContext("2d"), {
            type: "treemap",
            data: {
                datasets: this.data.datasets,
            },
            options: {
                response: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: ""
                },
                legend: {
                    display: false
                },

                tooltips: {
                    callbacks: {
                        title: function (item, data) {
                            return;
                        },
                        label: (item, data) => {
                            let label = ''
                            let dataset = data.datasets[item.datasetIndex];
                            console.log(dataset.groups);
                            let dataItem = dataset.data[item.index]

                            if (!this.data.hasGroup) {
                                dataItem = dataset.data[item.index]._data
                                console.log(dataItem);
                                label = dataItem[this.data.groupKey] + "(" + dataItem[dataset.key] + ")"
                            } else {
                                dataItem = dataset.tree[item.index]
                                for (let i = 0; i < dataset.groups.length; i++) {
                                    console.log(dataset.groups[i]);
                                    label += dataItem[dataset.groups[i]] + " "
                                }
                                label += " (" + dataItem[dataset.key] + ")"
                            }

                            return label
                        }
                    }
                }
            }
        });
    }

    getDataChart() {


        let {datasets, labels} = super.getDataChart()
        console.log(this.props.chart.data);
        let tree = datasets
        let key = this.props.chart.data.config.key
        let gr = this.props.chart.data.config.groups
        if (typeof (this.props.chart.data.config.groups) == 'string') {
            labels = [...datasets.map(i => i[gr])]
            gr = false
        }
        let finalDataset = [{
            label: 'Tree map de ejemplos',
            key: key,
            fontColor: "black",
            fontSize: 16,
            tree: tree,
            backgroundColor: (ctx,) => {
                let value;
                if (!gr) {
                    value = ctx.dataset.tree[ctx.dataIndex][key]
                } else {
                    value = ctx.dataset.data[ctx.dataIndex]
                    if (!value) {
                        return;
                    }
                    value = value.v
                }
                return this.colorFromValue({
                        value: value,
                        border: false,
                        index: ctx.dataIndex,
                        groups: gr,
                    }
                );
            },
            borderColor: "rgba(255,255,255, 1)",
            spacing: 1,
            borderWidth: 2.5,
            labels: {
                display: true,
                formatter(ctx) {
                    return "h"
                }
            }
        }
        ]

        if (gr) {
            finalDataset[0]['groups'] = gr
        }
        return {
            datasets: finalDataset,
            labels,
            tree,
            hasGroup: gr,
            groupKey: this.props.chart.data.config.groups
        }
    }

    setBackgroundColor(ctx) {
        return this.colorFromValue({
                value: ctx.dataset.data[ctx.dataIndex].v,
                borer: false,
                index: ctx.dataIndex
            }
        );
    }

    setBorderColor(ctx) {
        return this.colorFromValue({
                value: ctx.dataset.data[ctx.dataIndex].v,
                borer: true,
                index: ctx.dataIndex
            }
        );
    }

    colorFromValue({value, border, index, groups}) {
        let factor = 20
        if (!groups) {
            factor = 15
        }
        let alpha = (1 + Math.log(value)) / factor;

        let color = this.getPaletteItem(index);
        if (border) {
            alpha += 0.01;
        }
        return Chart.helpers.color(color)
            .alpha(alpha)
            .rgbString();
    }

}

iBoardTreeMap
    .template = 'iboard.ChartJS'
