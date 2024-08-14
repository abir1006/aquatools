<?php

return [

    'pagination' => [
        'per_page' => 10,
        'order_by' => 'desc',
    ],

    'permission' => [
        'super_admin_slug' => 'super_admin',
        'company_admin_slug' => 'company_admin',
        'company_user_slug' => 'company_user',
    ],

    'message' => [
        'saved' => 'Successfully Saved',
        'updated' => 'Successfully Updated',
        'deleted' => 'Successfully Deleted',
        'not_found' => 'Record Not Found',
        'permission_denied' => 'Permission Denied'
    ],

    'dropdown' => [

        'subscription_duration' => [
            '1' => 'Monthly',
            '2' => 'Yearly'
        ],

        'currency' => [
            'NOK' => 'NOK',
            'USD' => 'USD',
            'EURO' => 'EURO',
        ]


    ]

];
