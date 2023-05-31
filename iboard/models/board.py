"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 2/21/23
@name: 
"""
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
            'id', 'name',
            ('chart_ids', (
                'id', 'title',
                'chart_type', 'description',
                'preview', 'palette', 'config',
                'set_icon', 'icon', 'title_design',
            ))
        ]
        return board.jsonify(one=True, parser=data)
