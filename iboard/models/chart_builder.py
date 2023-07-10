"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/17/23
@name: 
"""
import json
import logging
from json import JSONDecodeError

from odoo.addons.iboard.libs.chart_pie import ChartPie
from odoo.addons.iboard.libs.chart_bars import ChartBar
from odoo.addons.iboard.libs.chart_title import Title
from odoo.addons.iboard.libs.chart_tree import ChartTree



from collections import abc


def serialize_dict_keys(obj):
    if isinstance(obj, abc.KeysView):
        return list(obj)
    raise TypeError("Type %s is not serializable" % type(obj))


class ChartBuilder:
    def __init__(self, env):
        self.chart = None
        self.env = env
        self.domain = []
        self._data = {
            'labels': [],
            'datasets': [],
        }
        self._logger = logging.getLogger(__name__)
        self.chart_ob = None

    def set_chart(self, chart):
        self.chart = chart
        if self.chart.chart_type == 'title':  # changes for constant
            self.chart_ob = Title(chart)
        elif self.chart.chart_type == 'bar':
            self.chart_ob = ChartBar(chart)
        elif self.chart.chart_type == 'pie':
            self.chart_ob = ChartPie(chart)
        elif self.chart.chart_type == 'tree':
            self.chart_ob = ChartTree(chart)

    def get_data(self):
        if not self.chart:
            raise ValueError("Error al procesar la data del indicador")
        self._data = self.chart_ob.compute().get_data()
        return self

    def to_json(self):
        return json.dumps(self._data, default=list)



