/** @odoo-module **/
import {iboardFormat} from "./helpers";

export const doughnutLabel = {
    id: 'doughnutLabel',
    beforeDatasetDraw(chart, args, pluginOptions) {
        const {ctx, data} = chart
        ctx.save()

        const xCoor = chart.getDatasetMeta(0).data[0].x
        const yCoor = chart.getDatasetMeta(0).data[0].y

        ctx.font = 'bold 30px sans-serif'
        ctx.fillStyle = '#979797'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle';
        let suma = data.datasets[0].data.reduce((c, a) => c + a, 0)

        ctx.fillText(iboardFormat(suma, 'number'), xCoor, yCoor)
    }
}