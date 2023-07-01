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
        # menu
        'views/menu.xml',
        # data
        'data/colors1.xml',
        'data/colors2.xml',
        'data/colors3.xml',
    ],
    'demo': [

    ],
    'assets': {
        'assets_common': [
        ],
        'web.assets_qweb': [
            'iboard/static/src/xml/board.xml',
            'iboard/static/src/xml/title.xml',

        ],
        'web.assets_backend': [
            'iboard/static/src/js/common.js',
            'iboard/static/src/js/components/helpers.js',
            'iboard/static/src/js/board.js',
            'iboard/static/src/js/components/chart_factory.js',
            'iboard/static/src/js/components/base_chart.js',
            'iboard/static/src/js/components/title_chart.js',
            'iboard/static/src/js/components/pie_chart.js',
            'iboard/static/src/js/components/bar_chart.js',

        ],
    },

    'installable': True,
    'auto_install': False
}
