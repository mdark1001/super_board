"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/31/23
@name: 
"""
from .chart_base import ChartBase
from .operations import Operations


class ChartMap(ChartBase, Operations):
    """"   """

    def __init__(self, builder):
        self.data.update({
            'labels': [],
            'datasets': [],
        })
        self._builder = builder

    def compute(self):
        # self.set_field_name()
        # self.set_options()
        # self.group_by()
        # self.preparate_values()
        # self.set_values()
        # self._logger(self.data)
        return self

    def get_data(self):
        return self.data
