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
        # menu
        'views/menu.xml',
    ],
    'demo': [

    ],
    'assets': {
        'assets_common': [
        ],
        'web.assets_qweb': [
            'iboard/static/src/xml/board.xml',

        ],
        'web.assets_backend': [
            'iboard/static/src/js/lib/css/title.css',
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
