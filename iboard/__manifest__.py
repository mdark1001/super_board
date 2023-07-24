{
    'name': 'iBoard',
    'version': '15.0.1',
    'summary': 'Módulo para generar tableros de control',
    'description': "Crearción de tableros, indicadores y muchos más...",
    'category': 'Tools',
    'author': 'Miguel Cabrera R. <miguel.cabrera@oohel.net>',
    'website': 'https://oohel.net',
    'license': 'GPL-3',
    'depends': [
        'mail',
        'jsonifier',
    ],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        # wizards
        # views
        'views/board.xml',
        'views/chart.xml',
        # config
        'views/colors.xml',
        'views/geo_map.xml',
        # menu
        'views/menu.xml',
        # data
        'data/colors1.xml',
        'data/colors2.xml',
        'data/colors3.xml',
        'data/colors4.xml',
    ],
    'demo': [

    ],
    'assets': {
        'web.assets_common': [
            'iboard/static/src/css/field_color.css',
        ],

        'web.assets_backend': [
            'iboard/static/src/js/common.js',
            'iboard/static/src/js/components/helpers.js',
            'iboard/static/src/js/components/plugins.js',
            'iboard/static/src/js/board_action.js',
            'iboard/static/src/js/components/factory.js',
            'iboard/static/src/js/components/base.js',
            'iboard/static/src/js/components/title.js',
            'iboard/static/src/js/components/doughnut.js',
            'iboard/static/src/js/components/bars.js',
            'iboard/static/src/js/components/tree-map.js',
            'iboard/static/src/js/components/maps.js',

            # widgets
            'iboard/static/src/js/widgets/field_color.js',
            #
            'iboard/static/src/xml/board.xml',
            'iboard/static/src/xml/field_color.xml'

        ],
    },

    'installable': True,
    'auto_install': False
}
