"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 7/24/23
@name: 
"""
import json
import base64
from odoo import http
from odoo.http import route, request, Response
import logging

_logger = logging.getLogger(__name__)


class ChartMapController(http.Controller):
    """
        Controlador que permite obtener los archivos de
        configuración  de los mapas
    """

    @route('/api/v1/map/geo-chart/<int:chart_id>',
           methods=['GET'],
           type="http",
           auth="public"
           )
    def map_geo(self, chart_id: int, *args, **kwargs):
        chart = request.env['iboard.chart'].sudo().browse(chart_id)
        if not chart.exists():
            return {'message': "No se encontró la gráfica solicitado"}
        _logger.info(base64.b64decode(chart.geo_map_file_id.geo_map))
        response = Response()
        response.mimetype = 'application/json'
        response.data = json.dumps({
            "file": base64.b64decode(chart.geo_map_file_id.geo_map).decode("utf-8"),
            "data": []
        })

        return response
        return json.dumps({
            # "file": base64.b64decode(chart.geo_map_file_id.geo_map)
        })
