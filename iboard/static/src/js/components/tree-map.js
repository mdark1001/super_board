/** @odoo-module **/
import {iboardBaseChart} from "./base_chart";

const {onMounted} = owl


export class iBoardTreeMap extends iboardBaseChart {

    async setup() {
        super.setup();
        console.log(this.colors);
        this.state.margin = {
            top: 1,
            right: 10,
            bottom: 10,
            left: 10
        }
        this.state.node = false
        this.setFactorDeviceSize(1)
        onMounted(this.mounted)
    }

    mounted() {
        //super.mounted();
        this.draw()
    }

    redrawSize() {
        super.redrawSize();
    }

    async draw() {
        super.draw();
        let svg = this.getSVGSelector()

        let _h = this.getHeight()
        let _w = this.getWidth()

        let width = (_w )
        let height = (_h - this.state.margin.top) - this.state.margin.bottom;
        this.startSVG(
            {
                width: width,
                height: height,
                pos_x: (this.state.margin.left + 30),
                pos_y: this.state.margin.top
            }
        )
        // read  data
        this.data = this.getDataChart()
        let key = this.data.config.key;

        // Give the data to this cluster layout:
        let root = d3.hierarchy(this.data.datasets).sum(function (d) {
            return d[key]
        })

        // Then d3.treemap computes the position of each element of the hierarchy
        let setWidth = width - this.state.margin.left - this.state.margin.right
        if (!this.hasSubgroup()) { //
            d3.treemap()
                .size([setWidth, height])
                .padding(1)
                (root)
        } else {
            d3.treemap()
                .size([setWidth, height])
                .paddingTop(28)
                .paddingRight(5)
                .paddingInner(2)
                (root)
        }

        // use this information to add rectangles:
        this.startDrawRect(root)
        // and to add the text labels
        if (this.props.chart.config.showLabels)
            this.startAddTextLevels(root)
        if (this.props.chart.config.showTotal)
            this.startAddTextTotal(root)

        if (this.hasSubgroup()) {
            this.setSubgroupLabels(root)
        }

    }

    hasSubgroup() {
        return typeof (this.data.config.groups) !== 'string';
    }


    startSVG({width, height, pos_x, pos_y}) {
        this.node = this.getSVGSelector()
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + pos_x + "," + pos_y + ")");
    }

    startDrawRect(root) {
        let scaleColor = this.calcScaleColor(root)
        let opacity = this.calcScaleOpacity(root)
        this.node
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) {
                return d.x0;
            })
            .attr('y', function (d) {
                return d.y0;
            })
            .attr('width', function (d) {
                return d.x1 - d.x0;
            })
            .attr('height', function (d) {
                return d.y1 - d.y0;
            })
            .style("stroke", "white")
            .style("fill", (d) => {
                return scaleColor(d.parent.data.name)
            })
            .style("opacity", (d) => {
                if (!this.hasSubgroup())
                    return opacity(d.value)
                return opacity[d.parent.data.name](d.value)
            })
            .on("mouseover", this.showTooltip.bind(this))
            .on("mousemove", this.moveTooltip.bind(this))
            .on("mouseout", this.hideTooltip.bind(this));
    }


    startAddTextLevels(root) {
        let fontSize = d => Math.sqrt((d.x1 - d.x0) * (d.y1 - d.y0)) / 10;
        this.node
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .text((d) => {
                if (!this.hasSubgroup()) {
                    return d.data[this.data.config.groups]
                } else {
                    return d.data[this.data.config.groups[1]]
                }
            })
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => (d.y0 + d.y1) / 2)
            .attr("class", "indicator-body")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", fontSize)
            .attr("fill", this.props.chart.config.textColor || 'white')
    }

    startAddTextTotal(root) {
        let fontSize = d => Math.sqrt((d.x1 - d.x0) * (d.y1 - d.y0)) / 15;
        this.node
            .selectAll("text.total")
            .data(root.leaves())
            .enter()
            .append("text")
            .text((d) => {
                return d.value
            })
            .attr('class', "total")
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => ((d.y0 + d.y1) / 2) + (fontSize(d)))
            .attr("class", "indicator-body")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", fontSize)
            .attr("fill", this.props.chart.config.textColorTotal || 'white')
            .attr('word-wrap', 'break-word')
    }

    setSubgroupLabels(root) {
        this.node
            .selectAll("titles")
            .data(root.descendants().filter(function (d) {
                return d.depth == 1
            }))
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x0
            })
            .attr("y", function (d) {
                return d.y0 + 21
            })
            .text(function (d) {
                return d.data.name
            })
            .attr("font-size", "19px")
            .attr("class", "indicator-body")
            .attr("fill", function (d) {
                return "gray"
            })
    }

    getDataChart() {
        let {datasets, labels, config} = super.getDataChart()
        let grupos0 = new Set()
        if (this.props.chart.config?.filterByAThreshold) {
            datasets = datasets.filter(item => item[config.key] > this.props.chart.config.filterByAThreshold)
        }

        let df = {
            'name': 'Sexo',
            'children': [],

        }
        if (typeof (config.groups) == 'string') { // because still there is setting  to use hasSubgroup
            for (let i = 0; i < datasets.length; i++) {
                df.children.push(datasets[i])
            }
        } else {
            /*
               "name": "mister_a",
               "group": "A",
               "value": 28,
               "colname": "level3"
             */

            grupos0 = new Set(
                [
                    ...datasets.map(i => i[config.groups[0]])
                ]
            )

            for (let it = grupos0.values(), index = 0, val = null; val = it.next().value; index++) {
                df.children.push({
                    "name": val,
                    "children": []
                })

                df.children[index].children = datasets.filter(item => item[config.groups[0]] == val)
                    .map(i => {
                        return {...i, group: val}
                    })

            }

        }

        return {
            datasets: df,
            labels,
            config,
            parents: grupos0.values()
        }
    }

    calcScaleColor(root) {
        let groups = root.leaves().filter(i => i.depth == 1).map(item => item.name)
        let scaleColor = d3.scaleOrdinal()
            .domain(groups)
            .range(this.colors)
        return scaleColor;
    }

    calcScaleGroups(root, bottom, top) {
        let opacity = undefined
        if (!this.hasSubgroup()) {
            opacity = d3.scaleLinear()
                .domain([
                    d3.min(root.leaves(), d => d.value),
                    d3.max(root.leaves(), d => d.value)
                ])
                .range([bottom, top])
        } else {
            opacity = {}
            for (let parent of this.data.datasets.children) {
                opacity[parent.name] = d3.scaleLinear()
                    .domain([
                        d3.min(
                            root.leaves().filter(i => i.parent.data.name === parent.name), d => d.value),
                        d3.max(
                            root.leaves().filter(i => i.parent.data.name === parent.name), d => d.value),
                    ])
                    .range([bottom, top])
            }
        }
        console.log(opacity);
        return opacity
    }


    calcScaleOpacity(root) {
        return this.calcScaleGroups(root, 0.5, 1)
    }

    getTooltipSelector() {
        return d3.select("#tooltip_" + this.props.chart.id);
    }

    showTooltip(event, d) {
        console.log(d);
        let key = this.data.config.key
        const tooltip = this.getTooltipSelector()
        tooltip
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY - 100}px`)
            .style("display", "inline-block")
            .html(`${d.data[this.data.config.groups[0]]} - ${d.data[this.data.config.groups[1]]} : ${d.data[key]}`);
    }

    moveTooltip(event) {
        const tooltip = this.getTooltipSelector()
        tooltip
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY}px`);
    }

    hideTooltip() {
        const tooltip = this.getTooltipSelector()
        tooltip.style("display", "none");
    }

}

iBoardTreeMap.template = 'iboard.BaseChart'
