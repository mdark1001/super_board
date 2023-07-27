"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 03/07/23
@name: 
"""

from .chart_base import ChartBase
from .operations import Operations
from collections import defaultdict


class ChartBar(ChartBase, Operations):
    """"   """
    options_2: dict = None
    field_name_2: str = None

    def __init__(self, builder):
        self.sum_groups = defaultdict(int)
        self.data.update({
            'labels': [],
            'datasets': [],
        })
        self._builder = builder

    @property
    def has_subgroup(self):
        if self._builder.model_field_group_by_2.exists():
            return True
        return False

    def set_field_name_subgroup(self):
        self.field_name_2 = self._builder.model_field_group_by_2.name

    def set_options_subgroup(self):
        if self._builder.model_field_group_by_2.ttype == 'selection':
            self.options_2 = self._builder.get_values_selection(
                self._builder.getModelName(),
                self.field_name_2
            )

    def get_data(self):
        return self.data

    def order_by(self):
        if not self.has_subgroup:
            return super(ChartBar, self).order_by()
        return self

    def get_agg_name(self):
        if self.has_subgroup:
            if self._builder.operation_model_1 != 'count':
                return self._builder.model_field_1.name
            return '__count'
        return super(ChartBar, self).get_agg_name()

    def group_by(self):
        fields = [
            self.field_name,
        ]
        groups = [
            self.field_name,
        ]
        if self._builder.operation_model_1 != 'count':
            fields.append(
                self._builder.model_field_1.name + ':' + self._builder.operation_model_1
            )
        lazy = True
        if self.has_subgroup:
            groups.append(
                self.field_name_2
            )
            lazy = False
        self.groups = self._builder.getModel().read_group(
            domain=self._builder.get_domain(),
            fields=fields,
            groupby=groups,
            lazy=lazy,
            limit=self.get_limit(),
        )

        return self

    def set_values_date_x(self):
        super().set_values_date_x()

    def get_labels(self):
        return list(set([p[self.field_name] for p in self.results]))

    def preparate_values(self):
        """
        """
        super(ChartBar, self).preparate_values()
        if self.has_subgroup:
            field_2 = self._builder.model_field_group_by_2
            for group in self.groups:
                group[field_2.name] = self._get_value_form_dict_results(
                    group,
                    field_2,
                    options=self.options_2
                )
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
