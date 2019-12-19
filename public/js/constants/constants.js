var constants = {
    AUTH: {
        INIT: 'AUTH_INIT',
        AUTHO: {
            GET: 'AUTHO_GET',
            LOCK: 'AUTHO_LOCK',
            SHOW: 'AUTHO_SHOW',
            LOGOUT: 'AUTHO_LOGOUT'
        },
        SPOTTER: {
            GET: 'SPOTTER_TRAINER_GET'
        }
    },
    CLIENT: {
        ADD: 'CLIENT_ADD',
        DELETE: 'CLIENT_DELETE',
        SET: 'CLIENT_SET',
        IMAGE: {
            ADD: 'CLIENT_IMAGE_ADD',
            UPLOADED: 'CLIENT_IMAGE_UPLOADED'
        },
        UPDATE: 'CLIENT_UPDATE'
    },
    CLIENTS: {
        GET: 'CLIENTS_GET'
    },
    EMAIL: {
        SEND: 'EMAIL_SEND'
    },
    TRAINER: {
        IMAGE: {
            ADD: 'TRAINER_IMAGE_ADD',
            UPLOADED: 'TRAINER_IMAGE_UPLOADED'
        },
        UPDATE: 'TRAINER_UPDATE'
    },
    PRODUCTS: {
        GET: 'PRODUCTS_GET',
        ADD: 'PRODUCTS_ADD',
        REMOVE: 'PRODUCTS_REMOVE',
        RESET: 'PRODUCTS_RESET',
        SEARCH: 'PRODUCTS_SEARCH'
    },
    MASTERPRODUCTS: {
        SEARCH: 'MASTER_PRODUCTS_SEARCH',
        SELECTED: 'MASTER_PRODUCTS_SELECTED',
        VALUE: 'MASTER_PRODUCTS_VALUE'
    },
    CHILDPRODUCTS: {
        GET: 'CHILD_PRODUCTS_GET'
    },
    PAGE: {
        GOBACK: 'PAGE_BACK',
        UPDATE: 'PAGE_UPDATE'
    }
};

module.exports = constants;
