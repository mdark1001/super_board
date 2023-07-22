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

    def preparate_values(self):

        self._logger(self.options)
        self._logger(self.options_2)
        self._logger(self.groups)
        res = []
        key = self.get_agg_name()
        sub = False
        if self.has_subgroup:
            sub = True

        for group in self.groups:
            self._logger(group)
            field_1 = self._get_value_form_dict_results(
                group,
                self._builder.model_field_group_by_1,
                options=self.options
            )

            if sub:
                self.sum_groups[field_1] = self.sum_groups[field_1] + group[key]
                field_2 = self._get_value_form_dict_results(
                    group,
                    self._builder.model_field_group_by_2,
                    options=self.options_2
                )
                res.append(
                    {
                        key: group[key],
                        self.field_name: field_1,
                        self.field_name_2: field_2
                    }
                )
            else:
                res.append(
                    {
                        key: group[key],
                        self.field_name: field_1,
                    }
                )
        self.results = res
        return self

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
            self._logger(fields)
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

    def set_values(self):
        if not self.has_subgroup:
            self._logger("--" * 100)
            self._logger(self.results)
            return super(ChartBar, self).set_values()

        datasets = []
        self.data['title'] = self._builder.model_field_group_by_2.field_description
        key = self.get_agg_name()
        self.data['labels'] = self.get_labels()
        subgroups = list(set([p[self.field_name_2] for p in self.results]))
        for index, g in enumerate(subgroups):
            datasets.append(self.get_blank_dataset(g))
            for label in self.data['labels']:
                self._logger(g)
                self._logger(label)
                v = list(filter(lambda s: s[self.field_name] == label and
                                          s[self.field_name_2] == g,
                                self.results))
                self._logger(v)
                if len(v):
                    v = v[0][key]
                else:
                    continue
                datasets[index]['data'].append(v)
        self.data['datasets'] = datasets
        return self

    def get_labels(self):
        labels = list(set([p[self.field_name] for p in self.results]))
        if not self._builder.order_by:
            return labels

        reverse = False if self._builder.order_by == 'asc' else True

        labels = sorted(self.sum_groups.items(), key=lambda x: x[1], reverse=reverse)
        return list(map(lambda s: s[0], labels))

    def _get_value_form_dict_results(self, group, field, options):
        f = group[field.name]
        self._logger(f)

        if field.ttype in ('many2one', 'many2many'):
            return str(f[1]) if f else 'Indefinido'
        else:
            if field.ttype in ('date', 'datetime'):
                return f
            return options.get(f, 'Indefinido')
        return False

    def compute(self):
        if self.has_subgroup:
            self.set_field_name_subgroup()
            self.set_options_subgroup()
        self.set_field_name()
        self.set_options()
        self.group_by()
        self.order_by()
        self.preparate_values()
        self.set_values()
        self._logger(self.data)
        return self
