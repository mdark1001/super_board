"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/15/23
@name:
"""
import json

from odoo import api, fields, models
from odoo.addons.iboard.models.chart_builder import ChartBuilder


class iChart(models.Model):
    """ Definición de un indicador """
    _name = 'iboard.chart'
    _description = 'iBoard/Indicador'
    _rec_name = 'title'
    _order = 'orden ASC'

    title = fields.Char(
        string='Título',
        required=True
    )
    orden = fields.Integer(
        string='Orden',
        default=1
    )

    board_id = fields.Many2one(
        comodel_name='iboard.board',
        string='Tablero',
        required=True
    )
    chart_type = fields.Selection(
        string='Tipo de indicador',
        selection=[
            ('title', 'Tarjeta'),
            ('pie', 'Gráfico circular'),
            ('bar', 'Gráfico de barras'),
            ('text', 'Texto enriquecido'),
        ],
        required=True,
        default='pie',
    )

    preview = fields.Text(
        string="Preview Data",
        compute="get_preview_chart_data",
    )
    description = fields.Html(
        string="Descripción",
        required=False
    )

    model_id_1 = fields.Many2one(
        comodel_name='ir.model',
        string='Recurso',
        domain="[('access_ids','!=',False),('transient','=',False),"
               "('model','not ilike','base_import%'),('model','not ilike','ir.%'),"
               "('model','not ilike','web_editor.%'),('model','not ilike','web_tour.%'),"
               "('model','!=','mail.thread'),('model','not ilike','iboard%')]"
    )
    model_name_1 = fields.Char(
        string='Nombre del recurso',
        related='model_id_1.model'
    )

    domain_model_1 = fields.Char(
        string="Filtro",
        help="Escriba filtros que permitan crear gráficas"
    )

    operation_model_1 = fields.Selection(
        string='Operación',
        selection=[
            ('count', 'Conteo'),
            ('sum', 'Suma'),
            ('avg', 'Promedio'),
        ],
        default='count',
        required=False,
        help="Operation over model_1's field"
    )
    model_field_1 = fields.Many2one(
        comodel_name='ir.model.fields',
        string='Campo',
        required=False,
        domain="[('model_id','=',model_id_1),('name','!=','id'),('name','!=','sequence'),('store','=',True),"
               "'|','|',('ttype','=','integer'),('ttype','=','float'),"
               "('ttype','=','monetary')]",
    )
    model_field_group_by_1 = fields.Many2one(
        'ir.model.fields',
        domain="[('model_id','=',model_id_1),('name','!=','id'),('name','!=','sequence'),"
               "('store','=',True),('ttype','!=','binary'),"
               "('ttype','!=','one2many')]",
        string="Agrupar por",
        help=''
    )

    # apariencia
    palette_id = fields.Many2one(
        comodel_name='iboard.config.palette',
        string='Paleta de colores',
        required=True,
        default=lambda self: self.env.ref('iboard.palette_1')
    )
    config = fields.Text(
        string='Chart Config',
        required=False
    )
    set_icon = fields.Boolean(
        string='Usar ícono',
        required=False
    )
    icon = fields.Char(
        string='ícono',
        required=False,
        default='fa-users'
    )
    title_design = fields.Selection(
        string='Diseño',
        selection=[
            ('d0', 'Sin diseño'),
            ('d1', 'Diseño uno'),
            ('d2', 'Diseño dos'),
            ('d3', 'Diseño tres'),
        ],
        required=False,
        default='d0'
    )

    def get_preview_chart_data(self):
        cb = ChartBuilder(self.env)
        for record in self:
            cb.set_chart(record)
            record.preview = cb.get_data().to_json()

    @api.model
    def create(self, values):
        values['config'] = self.get_default_config(values.get('chart_type'))
        result = super(iChart, self).create(values)
        layout = json.loads(result.board_id.layout or {})
        layout[result.id] = {
            'x': 0,
            'y': 0,
            'id': result.id
        }
        result.board_id.write({
            'layout': json.dumps(layout)
        })
        return result

    @staticmethod
    def get_default_config(chart_type):
        data = {
            'width': '250px',
            'height': '250px',
            'gsMinWidth': 3,
            'gsMinHeight': 1,
        }
        if chart_type == 'pie':
            data.update({
                'width': '450px',
                'height': '450px',
                'filter_empty': True,
                'gsMinWidth': 3,
                'gsMinHeight': 3,
                'typeTooltip': 'tooltip',
                'showTotal': False,
            })
        return json.dumps(data, indent=6)
