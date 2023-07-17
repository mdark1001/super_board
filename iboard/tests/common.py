"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 7/11/23
@name: 
"""

from odoo.tests.common import TransactionCase


class TestCaseCommonCharts(TransactionCase):

    @classmethod
    def setUpClass(cls):
        super(TestCaseCommonCharts, cls).setUpClass()

        Users = cls.env['res.users'].with_context({
            'mail_create_nolog': True,
            'mail_create_nosubscribe': True,
            'mail_notrack': True,
            'no_reset_password': True,
            'notification_type': 'inbox',
        })
        cls.admin_user = Users.create({
            'name': 'Admin',
            'login': 'admin_sb',
            'email': 'admin_sp@example.com',
            'password': 'admin12345',
            # 'signature': 'SignAdminRefimesa',
            'groups_id': [(6, 0, [
                cls.env.ref('iboard.iboard_admin').id,
            ])]
        })
