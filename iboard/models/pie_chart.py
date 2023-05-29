"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/17/23
@name: 
"""


class Pie:

    def __init__(self, chart, builder):
        self.chart = chart
        self.builder = builder

    def get_data(self):

        return

    def get_data_counter(self):

        Model = self.env[self.chart.model_name_1]
        field_name = self.chart.model_field_group_by_1.name
        if self.chart.model_field_1.ttype == 'many2many':
            pass
        results = Model.read_group(
            domain=self.get_damain(),
            fields=[field_name],
            groupby=[field_name],
            lazy=True
        )
        self._logger.info(results)
        if self.chart.model_field_group_by_1.ttype == 'selection':
            options = self.get_values_selection(
                Model,
                field_name
            )
            results = {option[field_name]: option[field_name + '_count'] for option in results}
            self._logger.info(results)
            self._data['labels'] = [label[1] for label in options]
            self._data['datasets'] = [{
                'label': self.chart.model_field_group_by_1.field_description,
                'data': [
                    results.get(label[0], 0) for label in options
                ]
            }]