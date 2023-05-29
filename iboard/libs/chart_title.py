"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/26/23
@name: 
"""
from odoo.addons.iboard.libs.chart_base import ChartBase


class Title(ChartBase):

    def __init__(self, builder):
        self._builder = builder
        self.data = {
            'total': 0
        }

    def compute(self):
        Model = self._builder.env[self._builder.chart.model_name_1]
        field_name = self._builder.chart.model_field_group_by_1.name
        total = 0
        if self._builder.chart.operation_model_1 == 'count':
            total = Model.search_count(
                self._builder.get_domain(),
            )
        self.data['total'] = total

        return self.data

    def get_data(self):
        return self.data
