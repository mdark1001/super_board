"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 7/5/23
@name: 
"""


class Operations:
    """
    Clase que encargada de realizar las operaciones
    de agregación
    """
    options: dict = None
    groups: list = None
    results: dict = None
    data: dict = dict()

    def is_type_selection(self):
        return self._builder.model_field_group_1_ttype == 'selection'

    def set_options(self):
        if self.is_type_selection():
            self.options = self.get_selection_options(self.field_name)
        return self

    def get_selection_options(self, field) -> dict:
        return self._builder.get_values_selection(
            self._builder.getModelName(),
            field
        )

    def group_by(self):
        date_subgroup = self.get_date_agg()

        self.groups = self._builder.getModel().read_group(
            domain=self._builder.get_domain(),
            fields=[self.field_name],
            groupby=[self.field_name + date_subgroup],
            lazy=True
        )
        return self

    def get_agg_name(self):
        if self._builder.operation_model_1 != 'count':
            return self._builder.model_field_1.name
        return self.field_name + '_count'

    def order_by(self):
        if self._builder.order_by and self.groups:
            key = self.get_agg_name()
            reverse = False if self._builder.order_by == 'asc' else True
            self.groups.sort(reverse=reverse, key=lambda s: s[key])
        return self

    def preparate_values(self):
        if self.is_type_selection():
            self._set_result_from_selection_groups()
        else:
            pass
        return self

    def set_values(self):
        if self._builder.model_field_group_1_ttype == 'selection':
            self.set_values_selection()
        elif self._builder.model_field_group_1_ttype in ('date', 'datetime',):
            self.set_values_date_x()
        if self._builder.model_field_group_1_ttype in ('many2one', 'many2many'):
            self.set_values_m2x()
        return self

    def _set_result_from_selection_groups(self):
        key = self.get_agg_name()
        self.results = {
            str(option[self.field_name]): option[key]
            for option in self.groups
        }
        return self

    def set_values_date_x(self):
        self.data['title'] = self._builder.model_field_group_by_1.field_description
        self.data['datasets'].append(self.get_blank_dataset(self.data['title']))
        key = self.get_agg_name()
        for result in self.groups:
            name = str(result[self.field_name]) if result[self.field_name] else 'Indefinido'
            self.data['labels'].append(name)
            self.data['datasets'][0]['data'].append(result[key])
        return self

    def set_values_selection(self):

        self.data['title'] = self._builder.model_field_group_by_1.field_description
        self.data['datasets'].append(self.get_blank_dataset(self.data['title']))
        self.data['datasets'][0]['data'] = self.results
        self.data['labels'] = self.options.values()

    def set_values_m2x(self):
        self.data['title'] = self._builder.model_field_group_by_1.field_description
        self.data['datasets'].append(self.get_blank_dataset(self.data['title']))
        key = self.get_agg_name()
        for result in self.groups:
            name = str(result[self.field_name][1]) if result[self.field_name] else 'Indefinido'
            self.data['labels'].append(name)
            self.data['datasets'][0]['data'].append(result[key])

    def get_date_agg(self):
        if self._builder.model_field_group_1_ttype in ('date', 'datetime'):
            return ':' + self.model_field_1_date_agg
        return ''

    def get_blank_dataset(self, name):
        return {
            "label": name,
            "data": [],
            "borderWidth": 1
        }
