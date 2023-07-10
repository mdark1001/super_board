"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/26/23
@name: 
"""
from odoo.addons.iboard.libs.chart_base import ChartBase


class Title(ChartBase):

    def __init__(self, builder):
        self._builder = builder
        self.data = {
            'total': 0
        }

    def compute(self):
        model = self._builder.getModel()
        field_name = self._builder.model_field_1.name
        total = 0
        if self._builder.operation_model_1 == 'count':
            total = self.get_count(model)
        else:
            total = self._fetch_data_model(
                model=model,
                field=field_name,
                op=self._builder.operation_model_1
            )

        self.data['total'] = total
        return self

    def get_data(self):
        return self.data

    def get_count(self, model: object):
        return model.search_count(
            self._builder.get_domain(),
        )

    def _fetch_data_model(self, model, field, op):
        domain = self._builder.get_domain()
        query = model._where_calc(domain)
        model._apply_ir_rules(query, 'read')
        table, where_clause, where_clause_args = query.get_sql()
        raw_query = f"""
                    SELECT {op}({field}) as result 
                    FROM {table}
                """
        result = False
        if where_clause:
            raw_query = raw_query + ' WHERE %s' % where_clause
        try:
            self._builder.env.cr.execute(raw_query, where_clause_args)
            result = self._builder.env.cr.dictfetchall()
        except Exception as e:
            self._logger.error(e)

        return result[0]['result'] if len(result) else 0
