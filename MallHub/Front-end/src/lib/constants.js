export const API_URL = 'http://127.0.0.1:8000/api'

export const APP_NAME = "MallHub"

export const ERROR_MESSAGE = "Something went wrong";

export const ROLES_ENUM = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    STORE_MANAGER: 'STORE_MANAGER',
    DELIVERY: 'DELIVERY'
}

export const ORDER_STATUS_ENUM = {
    DELIVERED: 'DELIVERED',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING: 'PENDING'
}

export const LOCAL_STORAGE = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    ROLE: 'role',
    NAME: 'name',
}

export const ROLES = [
    {
        label: 'Admin',
        value: ROLES_ENUM.ADMIN,
    },
    {
        label: 'Customer',
        value: ROLES_ENUM.CUSTOMER,
    },
    {
        label: 'Store Manager',
        value: ROLES_ENUM.STORE_MANAGER,
    },
    {
        label: 'Delivery User',
        value: ROLES_ENUM.DELIVERY,
    }
]




export const paginationDefaultValues = {
    page: 1,
    per_page: 10,
    total_pages: 1,
    total_items: 0,
}