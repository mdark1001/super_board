/** @odoo-module **/

export const doughnutLabel = {
    id: 'doughnutLabel',
    beforeDatasetDraw(chart, args, pluginOptions) {
        const {ctx, data} = chart
        ctx.save()

        const xCoor = chart.getDatasetMeta(0).data[0]._view.x
        const yCoor = chart.getDatasetMeta(0).data[0]._view.y

        ctx.font = 'bold 30px sans-serif'
        ctx.fillStyle = '#979797'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle';
        let suma = data.datasets[0].data.reduce((c, a) => c + a, 0)
        ctx.fillText(suma, xCoor, yCoor)
    }
}