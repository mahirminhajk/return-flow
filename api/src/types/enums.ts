export enum ErrTypes {
    NOT_FOUND = 'NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    BAD_REQUEST = 'BAD_REQUEST',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    PHONE_NOT_FOUND = 'PHONE_NOT_FOUND',
};

export enum UserStatusTypes {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
};

export enum TransactionTypes {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
};

export enum TransactionLabel {
    INVESTMENT = 'INVESTMENT',
    WITHDRAWAL = 'WITHDRAWAL',
    RETURN = 'RETURN',
    SERVICE = 'SERVICE',
    OTHERS = 'OTHERS',
}

export enum TransactionsCreatedBy {
    ADMIN = 'Admin',
    USER = 'User',
    SYSTEM = 'System',
};

export enum TransactionsStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
};

export enum LogsTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
    ACCEPT = 'ACCEPT',
    REJECT = 'REJECT',
};

export enum LogsCreatedBy {
    ADMIN = 'Admin',
    USER = 'User',
    SYSTEM = 'System',
};