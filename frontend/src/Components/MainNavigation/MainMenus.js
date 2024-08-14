const adminNavigationsObj = {

    'dashboard': {
        'link': '/admin/dashboard',
        'name': 'dashboard',
        'iconClass': 'menu-home-icon'
    },

    'companies': {
        'link': '/admin/companies',
        'name': 'companies',
        'iconClass': 'menu-company-icon'
    },
    'users': {
        'link': '/admin/users',
        'name': 'users',
        'iconClass': 'menu-user-icon'
    },

    'reports': {
        'link': '/admin/reports',
        'name': 'reports',
        'iconClass': 'menu-report-icon'
    },

    'at_materials': {
        'link': '/admin/at-materials',
        'name': 'at_materials',
        'iconClass': 'menu-materials-icon',
        'subMenuIconClass': 'menu-materials-icon-dark',
        'subMenus': {

            'All-Materials': {
                'link': '/admin/at_materials',
                'name': 'all_materials',
                'iconClass': ''
            },
            'All-Materials-Categories': {
                'link': '/admin/at_materials/categories',
                'name': 'all_materials_categories',
                'iconClass': ''
            },

            'All-Materials-Tags': {
                'link': '/admin/at_materials/tags',
                'name': 'tags',
                'iconClass': ''
            }
        }
    },

    'tools': {
        'link': '',
        'name': 'models',
        'iconClass': 'menu-model-icon',
        'subMenuIconClass': 'menu-model-icon-dark',
        'subMenus': {
            'genetics': {
                'link': '/admin/models/genetics',
                'name': 'model_genetics',
                'iconClass': ''
            },
            'optimalisering': {
                'link': '/admin/models/optimalisering',
                'name': 'model_optimization',
                'iconClass': ''
            },
            'cost_of_disease': {
                'link': '/admin/models/cost_of_disease',
                'name': 'model_cod',
                'iconClass': ''
            },
            'vaksinering': {
                'link': '/admin/models/vaksinering',
                'name': 'model_vaccination',
                'iconClass': ''
            },
            'mtb': {
                'link': '/admin/models/mtb',
                'name': 'model_mtb',
                'iconClass': ''
            },
            'kn_for': {
                'link': '/admin/models/kn_for',
                'name': 'model_feed',
                'iconClass': ''
            },
            'slaktmodel': {
                'link': '#',
                'name': 'model_harvest',
                'iconClass': ''
            },
        }
    },

    'templates':
        {
            'link':
                '/admin/templates',
            'name':
                'templates',
            'iconClass':
                'menu-template-icon'
        },

};

export default adminNavigationsObj;
