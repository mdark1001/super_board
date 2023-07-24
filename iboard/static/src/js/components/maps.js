/** @odoo-module **/
/*
* @author: Miguel Cabrera R.
* */
import {iBoardBase} from "./base";

export class Maps extends iBoardBase {
    constructor(element, data, colors) {
        super(data, colors);
        this.el = element.el
        this.svg = d3.select(this.el)
            .append("svg")
            .attr("id", "canvas_" + this.data.id)
            .attr("width", this.getWidth())
            .attr("height", this.getHeight())
        // .attr("viewBox", "0 0 600 400")
        // .attr("preserveAspectRatio", "xMinYMin meet")
    }

    async draw() {
        super.draw();

        //var svg = d3.select(this.el),
        let width = +this.svg.attr("width"),
            height = +this.svg.attr("height");

// Map and projection
        const projection = d3.geoMercator()
            .scale(this.getWidth()*1.5)
            .center([-102, 26])
        const path = d3.geoPath()
            .projection(projection)

// Load external data and boot
        //let data = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        let data = await d3.json(`/api/v1/map/geo-chart/${this.data.id}`)
        let mx = JSON.parse(data.file)
        console.log(mx);
        // Draw the map
        this.svg.append("path")
            .datum(topojson.feature(mx, mx.objects.MEX_adm1))
            .attr("fill", "#69b3a2")
            .attr("stroke", "white")
            .attr("d", path);
    }

    redraw(data) {
        super.redraw(data);
    }
}