"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 2/21/23
@name: 
"""
from collections import defaultdict
import json

from odoo import api, fields, models
from .helper import validate_record


class iBoard(models.Model):
    """ Definición de un tablero de control  """
    _name = 'iboard.board'
    _description = 'iBoard/Tablero'
    _order = 'name ASC'

    name = fields.Char(
        string='Tablero',
        required=True,
    )

    chart_ids = fields.One2many(
        comodel_name='iboard.chart',
        inverse_name='board_id',
        string='Indicadores',
        required=False
    )
    layout = fields.Text(
        string="Layout",
        required=False,
        default="{}"
    )

    def action_show_board(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.client',
            'tag': 'iboard_build',
            'target': 'main',
            'params': {
                'board_id': self.id,
            }
        }

    @api.model
    @validate_record(model='iboard.board', key='board_id')
    def get_charts(self, *args, **kwargs):
        board = kwargs.get('instance')
        data = [
            'id', 'name', 'layout',
            ('chart_ids', (
                'id', 'title',
                'chart_type', 'description',
                'preview', ('palette_id', ('id',)), 'config',
                'set_icon', 'icon', 'title_design', 'stacked', 'legend_position','order_by'
            ))
        ]
        data = board.jsonify(one=True, parser=data)
        palettes = self.get_palettes_colors()
        data['palettes'] = palettes
        return data

    @api.model
    @validate_record(model='iboard.board', key='board_id')
    def save_layout(self, *args, **kwargs):
        board = kwargs.get('instance')
        board.write({
            'layout': kwargs.get('layout')
        })
        charts_config = json.loads(kwargs.get('charts_config'))
        Chart = self.env['iboard.chart']
        for item in charts_config:
            Chart.browse(item['chartID']).write({
                'config': json.dumps(item['config'])
            })
        return {"state": "ok"}

    def get_palettes_colors(self):
        records = self.env['iboard.config.palette'].search(
            []
        ).jsonify(parser=[
            'id', 'name', ('color_ids', ('color',))
        ])
        data = defaultdict(list)
        for record in records:
            print(record)
            data[record['id']] = list(map(lambda s: s['color'], record['color_ids']))

        return data
