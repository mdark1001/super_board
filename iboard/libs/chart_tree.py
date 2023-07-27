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
        super(ChartTree, self).__init__(builder)


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
