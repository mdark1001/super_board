"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 7/11/23
@name: 
"""

from odoo.tests.common import users
from odoo.exceptions import ValidationError

from .common import TestCaseCommonCharts


class TestPieChart(TestCaseCommonCharts):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    @users('admin_sb')
    def test_check_if_one_is_one(self):
        self.assertEqual(1, 1)
