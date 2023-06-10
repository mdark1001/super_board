"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/31/23
@name: 
"""
from .chart_base import ChartBase


class ChartPie(ChartBase):
    """"   """

    def __init__(self, builder):
        self.data.update({
            'labels': [],
            'datasets': [],
        })
        self._builder = builder

    def compute(self) -> None:
        Model = self._builder.getModel()
        field_name = self._builder.chart.model_field_group_by_1.name
        if self._builder.chart.model_field_1.ttype == 'many2many':
            pass
        results = Model.read_group(
            domain=self._builder.get_domain(),
            fields=[field_name],
            groupby=[field_name],
            lazy=True
        )
        self._logger.info(results)
        if self._builder.chart.model_field_group_by_1.ttype == 'selection':
            options = self._builder.get_values_selection(
                Model,
                field_name
            )
            results = {
                option[field_name]: option[field_name + '_count']
                for option in results
            }
            self._logger.info(results)

            self.data['title'] = self._builder.chart.model_field_group_by_1.field_description
            self.data['datasets'] = [
                {
                    'label': label[1],
                    'value': results.get(label[0], 0)
                }
                for label in options
            ]
        if self._builder.chart.model_field_group_by_1.ttype == 'many2one':
            for result in results:
                # self._logger.info(str(result[field_name][1]))
                name = str(result[field_name][1]) if result[field_name] else 'Indefinido'
                self.data['datasets'].append({
                    'label': name,
                    'value': result[field_name + '_count']
                })

    def get_data(self):
        return self.data
