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

    menu_name = fields.Char(
        string='Nombre del menú',
        required=True,
        default='Tablero'
    )
    menu_parent_id = fields.Many2one(
        comodel_name='ir.ui.menu',
        string='Menú padre',
        required=True
        # domain="[('action','=',False)]"
    )
    menu_id = fields.Many2one(
        comodel_name='ir.ui.menu',
        string='Menú',
        required=False,
        readonly=True,
        # domain="[('action','=',False)]"
    )
    groups_ids = fields.Many2many(
        comodel_name='res.groups',
        string='Grupos de acceso'
    )
    action_id = fields.Many2one(
        comodel_name='ir.actions.client',
        string='Acción',
        required=False
    )

    @api.model
    def create(self, values):
        res = super(iBoard, self).create(values)
        # create action
        action = {
            'name': values['name'] + " Action",
            'res_model': 'iboard.board',
            'tag': 'iboard_action',
            'params': {'board_id': res.id},
        }
        res.action_id = self.create_action(action)
        res.menu_id = self.env['ir.ui.menu'].sudo().create({
            'name': values['menu_name'],
            'active': True,
            'parent_id': values['menu_parent_id'],
            'action': "ir.actions.client," + str(res.action_id.id),
            'groups_id': res.groups_ids.ids,
            'sequence': 10
        })
        return res

    def action_show_board(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.client',
            'tag': 'iboard_action',
            'name': 'Constructor de tableros',
            'target': 'current',
            'params': {
                'board_id': self.id,
            },
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
                'bar_orientation', 'legend_name',
                'set_icon', 'icon', ('color_id', ('color',)), 'title_design', 'stacked', 'legend_position', 'order_by'
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

    def create_action(self, action):
        return self.env['ir.actions.client'].sudo().create(action)

    def unlink(self):
        """
         Drop menu and action too,
        """
        for record in self:
            if record.action_id.exists():
                record.action_id.unlink()
            if record.menu_id:
                record.menu_id.unlink()
            super(iBoard, record).unlink()
