"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 30/06/23
@name: 
"""
from odoo import api, fields, models


class IboardConfigPalette(models.Model):
    """ Modelo para almacenar las paletas de colores de la gráfica """
    _name = 'iboard.config.palette'
    _description = "iBoard/Paletas de colores"

    name = fields.Char(
        string='Paleta de color',
        required=True
    )
    color_ids = fields.One2many(
        comodel_name='iboard.config.color',
        inverse_name='palette_id',
        string='Color',
        required=True,
    )


class IboardConfigColor(models.Model):
    """ Colores relacionados una paleta de colores """
    _name = 'iboard.config.color'
    _description = "iBoard/Paleta-color"
    _rec_name = 'color'

    color = fields.Char(
        string='Color',
        required=False
    )

    palette_id = fields.Many2one(
        comodel_name='iboard.config.palette',
        string='Paleta de color',
        required=True,
    )
