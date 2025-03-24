# RETURN FLOW CLIENT

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

## Pages And Usage
- [/login](http://localhost:5173/login) - User Login page
- [/admin/login](http://localhost:5173/admin/login) - Admin Login page
- [/](http://localhost:5173/) - Dashboard page
- [/admin/user](http://localhost:5173/admin/user) - Admin User page((Login as admin))
- /admin/user/:id - Admin User page((Login as admin))
- [/admin/notification](http://localhost:5173/admin/notification) - Admin Notification page((Login as admin))
- [/admin/settings](http://localhost:5173/admin/settings) - Admin Settings page(Login as admin)

- [/wallet](http://localhost:5173/wallet) - User Wallet page(Login as user)
- [/wallet/request-withdrawal](http://localhost:5173/wallet/request-withdrawal) - User Request Withdrawal page(Login as user)
