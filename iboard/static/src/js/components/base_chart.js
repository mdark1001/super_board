/** @odoo-module **/



const {Component} = owl;
const {EventBus} = owl.core;

export function iboarColors(palette) {
    let currentPalette = "oohel_4";
    if (!palette) palette = currentPalette;
    currentPalette = palette;

    /*Gradients
      The keys are percentage and the values are the color in a rgba format.
      You can have as many "color stops" (%) as you like.
      0% and 100% is not optional.*/
    let colorsPalette;
    if (palette === 'color1') {
        colorsPalette = [
            "#F79489",
            "#F8AFA6",
            "#FADCD9",
            "#F9F1F0",
        ]
    } else if (palette === 'color2') {
        colorsPalette = [
            "#FBE7C6",
            "#B4F8C8",
            "#A0E7E5",
            "#FFAEBC",
            "#FBE7C6",
            "#B4F8C8",
            "#A0E7E5",
            "#FFAEBC",
        ];
    } else if (palette === 'color3') {
        colorsPalette = [
            "#013A20",
            "#285E32",
            "#528443",
            "#83AB52",
            "#BAD260",
            "#F9F871",
        ]
    } else if (palette === 'color4') {
        colorsPalette = [
            "#013A20",
            "#9DB0A3",
            "#697B70",
            "#003856",
            "#146788",
        ]
    } else if (palette === 'color5') {
        colorsPalette = [
            "#A664B5",
            "#D06CA5",
            "#EA7C95",
            "#FA86B6",
            "#F79489",
        ]
    }


    return colorsPalette
}

export function iboardColorsTitle(palette) {
    let colorsPalette = [
        "#714B67",
        "#A55E74",
        "#D47773",
        "#F59A6B",
        "#A57C9A",
        "#FFE5FF",
        "#A0E7E5",
        "#00C89C",
    ];
    if (!palette)
        return '#C9CCD2'
    let colorIndex = parseInt(palette.substr(-1))
    return colorsPalette[colorIndex]
}

const {useExternalListener} = owl.hooks;

export class iboardBaseChart extends Component {
    options = {}
    chartID = ''
    chartType = 'bar'

    setup() {
        super.setup();
        this.chartID = 'chart_' + this.props.chart.id
        this.colors = iboarColors(this.props.chart?.palette)
        useExternalListener(window, "resizestop", this._onResize);

    }

    mounted() {
        super.mounted();

    }

    getResize(event) {
        console.log(event);
    }

    _onResize(event, ui) {
        console.log(event);
    }

    getWidth() {
        return parseInt(this.props.chart.config.width) * .8
    }

    getHeight() {
        return parseInt(this.props.chart.config.height) *.8
    }

    getDataChart() {
        let d = this.props.chart.data.datasets;
        if (this.props.chart.config.filter_empty) {
            d = d.filter(d => d.value > 0)
        }
        return d
    }

}

iboardBaseChart.template = 'iboard.BaseChart'
iboardBaseChart.bus = new EventBus()