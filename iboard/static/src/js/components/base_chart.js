/** @odoo-module **/


const {Component} = owl;

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
        "#00B0A7",
        "#68548D",
        "#3B8D79",
        "#98B0A9",
        "#95B65B",
        "#B4F8C8",
        "#A0E7E5",
        "#FFAEBC",
    ];
    if (!palette)
        return 'white'
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
        this.chartConfig = JSON.parse(
            this.props.chart.config
        )

    }

    setChartConfiguration() {
        this.data = JSON.parse(
            this.props.chart.preview
        )
        this.data.datasets[0].backgroundColor = this.colors;
        this.config = {
            type: this.chartType,
            data: this.data,
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
            }
        };
    }

    mounted() {
        super.mounted();

    }

    _onResize(event, ui) {
        console.log(event);
    }
}

iboardBaseChart.template = 'iboard.BaseChart'
