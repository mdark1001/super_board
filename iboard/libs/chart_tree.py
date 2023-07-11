"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/31/23
@name: 
"""
from .chart_bars import ChartBar
from .operations import Operations


class ChartTree(ChartBar, Operations):
    """"   """

    def __init__(self, builder):
        self.data.update({
            'labels': [],
            'datasets': [],
        })
        self._builder = builder

    def set_values(self):
        self.data['config'] = {
            'key': self.get_agg_name(),
            'groups': self.field_name
        }
        if self.has_subgroup:
            self.data['config']['groups'] = [
                self.field_name,
                self.field_name_2
            ]
        self.data['datasets'] = self.results
        return self

    def compute(self):
        if self.has_subgroup:
            self.set_field_name_subgroup()
            self.set_options_subgroup()
        self.set_field_name()
        self.set_options()
        self.group_by()
        self.preparate_values()
        self.set_values()
        self._logger(self.data)
        return self

    def get_data(self):
        return self.data
