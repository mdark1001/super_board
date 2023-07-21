"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/15/23
@name:
"""
import json

from odoo import api, fields, models
from odoo.tools.convert import safe_eval
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
            ('tree', 'Mapas de árbol'),
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
    model_field_1_date_agg = fields.Selection(
        string='Por fecha de',
        selection=[
            ('year', 'Año'),
            ('month', 'Mes'),
            ('day', 'Día'),
        ],
        required=False,
        default='year',
    )

    model_field_group_1_ttype = fields.Selection(
        string='Tipo de campo',
        related='model_field_group_by_1.ttype',
        store=True,
    )

    model_field_group_by_2 = fields.Many2one(
        'ir.model.fields',
        domain="[('model_id','=',model_id_1),('name','!=','id'),('name','!=','sequence'),"
               "('store','=',True),('ttype','!=','binary'),"
               "('ttype','!=','one2many')]",
        string="Subgrupo por",
        help=''
    )
    model_field_group_2_ttype = fields.Selection(
        string='Tipo de campo',
        related='model_field_group_by_2.ttype',
        store=True,
    )
    limit = fields.Integer(
        string='Límite',
        required=False,
        default=0
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
    bar_orientation = fields.Selection(
        string='Orientación',
        selection=[
            ('vertical', 'Vertical'),
            ('horizontal', 'Horizontal'),
        ],
        default='vertical',
        required=True,
    )

    stacked = fields.Boolean(
        string='Apiladas',
        default=False
    )
    legend_position = fields.Selection(
        string='Etiquetas',
        selection=[
            ('top', 'Arriba'),
            ('bottom', 'Abajo'),
            ('left', 'Izquierda'),
            ('right', 'Derecha'),
        ],
        required=True,
        default='top'
    )
    order_by = fields.Selection(
        string='Ordenar',
        selection=[
            ('desc', 'Decendiente'),
            ('asc', 'Acescente'),
        ],
        required=False,
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
            'gsHeight': 1,  # ancho por default
            'gsWidth': 2,  # alto por default
            'gsMinHeight': 1,  # minimo
            'gsMinWidth': 2,  # minimo,
            'gsMaxHeight': 11,
        }
        if chart_type == 'title':
            data.update({
                'gsMaxHeight': 1
            })
        if chart_type == 'pie':
            data.update({
                'width': '450px',
                'height': '450px',
                'filter_empty': True,
                'gsMinWidth': 3,
                'gsMinHeight': 3,
                'gsHeight': 3,  # ancho por default
                'gsWidth': 3,  # alto por default
                'typeTooltip': 'tooltip',
                'showTotal': False,

            })
        if chart_type == 'tree':
            data.update({
                'showTotal': False,
                'showLabels': True,
                'filterByAThreshold': 1,
                'textColor': 'white',
                'textColorTotal': 'white',
                'gsMinWidth': 3,
                'gsMinHeight': 3,
                'gsHeight': 4,  # ancho por default
                'gsWidth': 4,  # alto por default
            })
        return json.dumps(data, indent=6)

    def get_values_selection(self, model_name, field):
        """
        The get_values_selection function is a helper function that returns a list of tuples.
        The first element in the tuple is the key value and the second element in the tuple
        is its translated label. The model parameter should be an Odoo model object, and key
        should be one of its fields (e.g., 'state'). This function will return all values for
        the given field as tuples with their keys and labels.

        :param model: Get the selection values from the model
        :param key: Get the selection list of the fields
        :return: A list of tuples containing the selection key and its translation
        :doc-author: Trelent
        """
        # print(request.env.user.lang)
        _options = self.env[model_name]._fields[field]._description_selection(self.env)
        return {o[0]: o[1] for o in _options}

    def getModel(self):
        return self.env[self.model_name_1]

    def getModelName(self):
        return self.model_name_1

    def get_domain(self):
        _filter = []
        if not self.domain_model_1:
            return _filter
        try:
            _filter = safe_eval(self.domain_model_1)
        except JSONDecodeError as e:
            _filter = []
        return _filter
