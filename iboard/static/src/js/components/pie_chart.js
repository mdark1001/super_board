/** @odoo-module **/


import {iboarColors, iboardBaseChart} from "./base_chart";
import {useBus, useService} from "@web/core/utils/hooks";

export class iboardPieChart extends iboardBaseChart {
    chartType = 'doughnut'

    setup() {
        super.setup();
        this.chartID = 'chart_' + this.props.chart.id

    }

    async willStart() {
        super.willStart();
    }

    mounted() {
        super.mounted();
        this.chartID = 'chart_' + this.props.chart.id
        this.draw()

    }

    redrawSize(w, h) {
        this.props.chart.config.width = w;
        this.props.chart.config.height = h;
        d3.select("#" + this.chartID).html("");
        d3.select("div#chart_body_" + this.props.chart.id).html("")
        this.draw()
    }

    draw() {
        // Dimensions and settings
        var width = this.getWidth();
        var height = this.getHeight();
        var radius = Math.min(width, height) /2;
        var color = iboarColors(this.props.chart.palette)

        // Create the SVG element
        let svg = d3.select("#" + this.chartID)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Generate the arcs
        var arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);

        // Generate the pie layout
        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        let data = this.getDataChart()
        console.log(data);
        // Generate the chart
        var path = svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color[i % color.length]);

        // Create a container for the legend
        var legend = d3.select("div#chart_body_" + this.props.chart.id)
            .append("div")
            .attr("class", "legend");

        // Add a color-coded box and labels for each data point
        var legendItems = legend.selectAll(".legend-item")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "legend-item");

        legendItems.append("span")
            .attr("class", "legend-color")
            .style("background-color", (d, i) => {
                return color[i % color.length]
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

    catchResize(event) {
        console.log(event);
    }

}
