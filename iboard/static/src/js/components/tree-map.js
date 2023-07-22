/** @odoo-module **/
import {iBoardBase} from "./base";

export class TreeMap extends iBoardBase {
    _data;

    constructor(element, data, colors) {
        super(data, colors);
        console.log(this.data);
        this.el = element.el
        this.margin = {
            top: 1,
            right: 10,
            bottom: 10,
            left: 10
        }
        d3.select(this.el).append("div")
            .attr("id", "tooltip_" + this.data.id)
            .attr("class", "toolTip")
        this.svg = d3.select(this.el)
            .append("svg")
            .attr("id", "canvas_" + this.data.id)
            .attr("width", this.getWidth())
            .attr("height", this.getHeight())
            // .attr("viewBox", "0 0 600 400")
            .attr("preserveAspectRatio", "xMinYMin meet")
        this.pos = {
            pos_x: (this.margin.left + 30),
            pos_y: this.margin.top
        }

    }

    draw() {
        super.draw();
        this.node = this.svg
            .append("g")
            .attr("transform", "translate(" + this.pos.pos_x + "," + this.pos.pos_y + ")");
        this._data = this.getDataChart()
        let key = this._data.config.key;
        let width = this.getWidth()
        let height = (this.getHeight() - this.margin.top) - this.margin.bottom;
        // Give the data to this cluster layout:
        let root = d3.hierarchy(this._data.datasets).sum(function (d) {
            return d[key]
        })

        // Then d3.treemap computes the position of each element of the hierarchy
        let setWidth = (width - this.margin.left - this.margin.right)
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
        if (this.data.config.showLabels)
            this.startAddTextLevels(root)
        if (this.data.config.showTotal)
            this.startAddTextTotal(root)

        if (this.hasSubgroup()) {
            this.setSubgroupLabels(root)
        }

    }

    hasSubgroup() {

        return typeof (this.data.data.config.groups) !== 'string';
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
            for (let parent of this._data.datasets.children) {
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
        //console.log(opacity);
        return opacity
    }

    calcScaleOpacity(root) {
        return this.calcScaleGroups(root, 0.5, 1)
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
                console.log(d);
                return d.parent.y1 - d.parent.y0;
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
                    return d.data[this._data.config.groups]
                } else {
                    return d.data[this._data.config.groups[1]]
                }
            })
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => (d.y0 + d.y1) / 2)
            .attr("class", "indicator-body")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", fontSize)
            .attr("fill", this.data.config.textColor || 'white')
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
            .attr("dy", "0.40em")
            .style("text-anchor", "middle")
            .style("font-size", fontSize)
            .attr("fill", this.data.config.textColorTotal || 'white')
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
        if (this.data.config?.filterByAThreshold) {
            datasets = datasets.filter(item => item[config.key] > this.data.config.filterByAThreshold)
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

    getTooltipSelector() {
        return d3.select("#tooltip_" + this.data.id);
    }

    showTooltip(event, d) {
        let key = this._data.config.key
        let label = `REPLACE :${d.data[key]}`
        if (this.hasSubgroup())
            label = label.replace('REPLACE', `${d.data[this._data.config.groups[0]]} - ${d.data[this._data.config.groups[1]]} `);
        else
            label = label.replace('REPLACE', d.data[this._data.config.groups])

        const tooltip = this.getTooltipSelector()
        tooltip
            .style("left", `${event.clientX}px`)
            .style("top", `${event.clientY-100}px`)
            .style("display", "inline-block")
            .html(label);
    }

    moveTooltip(event) {
        const tooltip = this.getTooltipSelector()
        tooltip
            .style("left", `${event.clientX}px`)
            .style("top", `${event.clientY-100}px`);
    }

    hideTooltip() {
        const tooltip = this.getTooltipSelector()
        tooltip.style("display", "none");
    }

}