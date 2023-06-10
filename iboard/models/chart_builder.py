"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/17/23
@name: 
"""
import json
import logging
from json import JSONDecodeError

from odoo.addons.iboard.libs.chart_pie import ChartPie
from odoo.addons.iboard.libs.chart_title import Title
from odoo.tools.convert import safe_eval


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
            self.chart_ob = Title(self)
        elif self.chart.chart_type == 'bars':
            pass
        elif self.chart.chart_type == 'pie':
            self.chart_ob = ChartPie(self)

    def get_data(self):
        if not self.chart:
            raise ValueError("Error al procesar la data del indicador")
        self.chart_ob.compute()
        self._data = self.chart_ob.get_data()
        return self

    def to_json(self):
        return json.dumps(self._data)

    def get_domain(self):
        _filter = []
        if not self.chart.domain_model_1:
            return _filter
        try:
            _filter = safe_eval(self.chart.domain_model_1)
        except JSONDecodeError as e:
            _filter = []
        return _filter

    def get_values_selection(self, model, field):
        """
        The get_values_selection function is a helper function that returns a list of tuples.
        The first element in the tuple is the key value and the second element in the tuple
        is its translated label. The model parameter should be an Odoo model object, and key
        should be one of its fields (e.g., 'state'). This function will return all values for
        the given field as tuples with their keys and labels.

        :param model: Get the selection values from the model
        :param key: Get the selection list of the fields
        :return: A list of tuples containing the selection key and its translation
        :doc-author: Trelent
        """
        # print(request.env.user.lang)
        return self.env['ir.translation'].with_context(lang=self.env.user.lang).get_field_selection(model._name,
                                                                                                    field)

    def getModel(self):
        return self.env[self.chart.model_name_1]
