# RETURN FLOW API

## Install
i use pnpm as package manager. you can use npm or yarn as well.
install pnpm globally
```bash
$ npm i -g pnpm
```
install dependencies
```bash
$ pnpm i
```

## Commands

### Run
```bash
$ pnpm run dev
```

### Build
```bash
$ pnpm run build
```

### Test
```bash
$ pnpm run test
```

### Test with watch mode
```bash
$ pnpm run test:watch
```

## API Playground
I use bruno to test the API. bruno is a simple CLI tool to test APIs.
`OPEN THE api-playground.json FILE IN BRUNO`
[download](https://www.usebruno.com/downloads)

## API Endpoints
- [GET] [/api/health](http://localhost:8080/api/health) - Check the health of the API

- [POST] [/api/v1/auth/login/user](http://localhost:8080/api/v1/auth/login/user) - user login
- [POST] [/api/v1/auth/logout/user](http://localhost:8080/api/v1/auth/logout/user) - user logout
- [POST] [/api/v1/auth/verify/user](http://localhost:8080/api/v1/auth/verify/user) - verify user

- [POST] [/api/v1/auth/login/admin](http://localhost:8080/api/v1/auth/login/admin) - admin login
- [POST] [/api/v1/auth/logout/admin](http://localhost:8080/api/v1/auth/logout/admin) - admin logout
- [POST] [/api/v1/auth/verify/admin](http://localhost:8080/api/v1/auth/verify/admin) - verify admin

- [POST] /api/v1/admin/create-user
- [POST] /api/v1/admin/create-admin
- [PATCH] /api/v1/admin/transaction/status - update transaction status
- [POST] /api/v1/admin/transaction/add/:userId - add transaction to user
- [POST] /api/v1/admin/transaction/add - add bulk transaction
- [GET] /api/v1/admin/user/transactions - get user transactions
- [DELETE] /api/v1/admin/transaction/remove/:transactionId - remove transaction 
- [GET] /api/v1/admin/users - get all users 
- [GET] /api/v1/admin/user/:userId" - GET user by id 
- [PATCH] /api/v1/admin/user/change-password/:userId - update user password
- [DELETE] /api/v1/admin/user/delete/:userId - delete user 
- [PATCH] /api/v1/admin/user/update/:userId - update user
- [PATCH] /api/v1/admin/change-password - 
- [GET] /api/v1/admin/notifications - 
- [PATCH] /api/v1/admin/dashboard - 

- [POST] /api/v1/user/wallet/request-withdraw - 
- [GET] /api/v1/user/wallet/transactions - 
