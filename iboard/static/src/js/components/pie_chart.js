/** @odoo-module **/


import {iboarColors, iboardBaseChart} from "./base_chart";
import {useBus, useService} from "@web/core/utils/hooks";

export class iboardPieChart extends iboardBaseChart {
    chartType = 'doughnut'

    setup() {
        super.setup();
        this.state.unSelected = []

    }

    async willStart() {
        super.willStart();
    }

    mounted() {
        super.mounted();
        this.setFactorDeviceSize(.6)
        this.draw()
    }


    draw() {
        // Dimensions and settings
        super.draw();
        let width = this.getWidth();
        let height = this.getHeight();
        let radius = Math.min(width, height) / 2;
        this.color = this.props.colors(this.props.chart.palette_id?.id)
        // Create the SVG element
        this.svg = this.startSVG(
            width,
            height,
            width - 50,
            height / 2
        )
        // Generate the arcs
        this.arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);
        this.data = this.getDataChart()
        console.log(this.data);
        // Generate the pie layout
        this.pie = this.startPie()

        this.data = this.filterUnSelectedOptions()
        // Generate the chart
        this.arcs = this.svg.selectAll("arc")
            .data(this.pie(this.data))
            .enter()
            .append("g");

        this.arcs.append("path")
            .attr("d", this.arc)
            .attr("fill",
                (d, i) => this.getPaletteItem(i)
            );

        if (this.props.chart.config.typeTooltip == 'tooltip') {
            this.startTooltip()
            this.setLegend()
        } else if (this.props.chart.config.typeTooltip == 'percent') {
            this.startPercent(width, height, radius)
        }
        if (this.props.chart.config.showTotal) {
            this.startShowTotal(width, height)
        }


    }


    startPie() {
        return d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
    }

    startTooltip() {
        this.svg.selectAll("path").on(
            'mouseover', (e) => {
                d3.select("#tooltip_" + this.props.chart.id)
                    .style("left", (e.pageX * .15) + "px")
                    .style("top", (e.pageY * .15) + "px")
                    .style("display", "inline-block")
                    .text(e.target.__data__.data.label + ' ' + e.target.__data__.value)
            }).on("mouseout", (e) => {
            d3.select("#tooltip_" + this.props.chart.id)
                .style("display", "none");
        });
    }

    setLegend() {
        // Create a container for the legend
        var legend = d3.select("div#chart_body_" + this.props.chart.id)
            .append("div")
            .attr("class", "legend");
        // Add a color-coded box and labels for each data point
        let data = [...this.data, ...this.state.unSelected]
        var legendItems = legend.selectAll(".legend-item")
            .data(data)
            .enter()
            .append("div")
            .attr("class", (d) => {
                return 'legend-item ' + (this.getIndexLegendFromText(d.label) === -1 ? '' : 'unselected')
            })
            .on("click", this.legendClick.bind(this))


        legendItems.append("span")
            .attr("class", "legend-color")
            .style("background-color", (d, i) => {
                return this.getIndexLegendFromText(d.label) === -1 ? this.getPaletteItem(i) : 'gray'
            });

        legendItems.append("span")
            .attr("class", "legend-category")
            .text(function (d) {
                return d.label;
            });

        legendItems.append("span")
            .attr("class", "legend-value")
            .text(function (d) {
                return "(" + d.value + ")";
            });


    }

    startPercent(width, height, radius) {
// Add tick labels for each category
        this.arcs
            .append("circle")
            .attr("cx", (d) => {
                const pos = this.arc.centroid(d);
                return pos[0];
            })
            .attr("cy", (d) => {
                const pos = this.arc.centroid(d);
                return pos[1];
            })
            .attr("r", 5) // Adjust the size of the marker
            .style("fill", "white")
            .style("stroke", "black");

// Add lines from markers to category names
        this.arcs
            .append("line")
            .attr("class", "connector-line")
            .attr("x1", (d) => {
                const pos = this.arc.centroid(d);
                return pos[0];
            })
            .attr("y1", (d) => {
                const pos = this.arc.centroid(d);
                return pos[1];
            })
            .attr("x2", (d) => {
                const pos = this.arc.centroid(d);
                const midAngle = Math.atan2(pos[1], pos[0]);
                const x = Math.cos(midAngle) * (radius + 10); // Adjust the length of the lines
                return x;
            })
            .attr("y2", (d) => {
                const pos = this.arc.centroid(d);
                const midAngle = Math.atan2(pos[1], pos[0]);
                const y = Math.sin(midAngle) * (radius);
                return y;
            });


        this.arcs.append("text")
            .attr("transform", d => {
                const pos = this.arc.centroid(d);
                const midAngle = Math.atan2(pos[1], pos[0]);
                const x = Math.cos(midAngle) * (radius + 10); // Adjust the distance of labels from the pie chart
                const y = Math.sin(midAngle) * (radius + 10);
                return `translate(${x}, ${y})`;
            })
            //.attr("text-anchor", "middle")
            .attr("text-anchor", d => {
                const pos = this.arc.centroid(d);
                return (pos[0] >= 0) ? "start" : "end";
            })
            .attr("class", "legend-category")
            .style("cursor", 'pointer')
            .on('click', this.legendClick.bind(this))
            .text(d => {
                    return d.data.label + " (" + d.value + ")"
                }
            );

    }

    startShowTotal(width, height) {
        let sumaTotal = [...this.data].reduce((previousValue, currentValue) => {
            return previousValue + currentValue.value
        }, 0)
        let BigNumber = d3.select("#" + this.state.chartID).append("g")
            .attr("transform", "translate(" + ((width / 2) + 50) + "," + ((height / 2) + 20) + ")")
            .append("text")
            .attr('class', "indicator-card-number")
            .attr("title", sumaTotal + " Registros")
            .text(sumaTotal)
    }


    legendClick(event) {
        if (event.target.className !== 'legend-category')
            return
        let option = event.target.textContent

        let index = this.getIndexLegendFromText(option)
        if (index === -1) {
            this.state.unSelected.push({
                label: option,
                value: 0
            })
        } else {
            this.state.unSelected.splice(index, 1)
        }
        this.redrawSize()
    }

    getIndexLegendFromText(option) {
        return this.state.unSelected.findIndex(t => t.label === option)
    }

    filterUnSelectedOptions() {
        return this.data
    }


}
