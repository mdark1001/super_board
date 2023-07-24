"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 7/24/23
@name: 
"""

from odoo import api, fields, models


class iboardMapGeoFile(models.Model):
    """

    """
    _name = 'iboard.geo.map'
    _description = 'Mapas'

    name = fields.Char(
        string='Nombre',
        required=False
    )

    geo_map = fields.Binary(
        attachment=True,
        string="Archivo",
    )
