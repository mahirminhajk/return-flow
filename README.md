# RETURN FLOW

## 1. [Introduction](#introduction)
Return-flow is an open-source investment management platform built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript. It provides an automated system for managing users, tracking investments, and handling monthly return distributions.

Admins can onboard users by adding their name, phone number, password, investment amount, and investment start date. A cron job automatically credits users' wallets with their investment returns on the same date each month. Users can log in, check their wallet balance, and view transaction history.

Additionally, users can request withdrawals from their wallets(and provide additional information like UPI ID or Bank Details), which admins can approve or reject through a notification system in the admin panel.

This project aims to offer a secure, automated, and efficient way to manage investment payouts while maintaining transparency between admins and users.

## 2. [Technologies](#technologies)
- **Frontend**: React, TypeScript, shadcnui, tailwindcss, tanstack/react-query.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, cron, jsonwebtoken.
- **Testing**: Jest, supertest.
- **Playground**: [Bruno](https://www.usebruno.com/), MongoDB Compass.

## 3. [Installation](#installation)

1. Clone the repository:
```bash
git clone https://github.com/mahirminhajk/return-flow.git
```

2. Install PNPM globally:(if you don't have it installed)
- if you like to use npm, you can replace `pnpm` with `npm` in the following commands (use it on own risk).
- [pnpm installation doc](https://pnpm.io/installation)
```bash
npm install -g pnpm
```
3. Configure MongoDB:
- [Create a new cluster on MongoDB Atlas](https://www.mongodb.com/).
- OR [install MongoDB locally](https://docs.mongodb.com/manual/installation/).

4. Install dependencies:
```bash
cd api
pnpm install
cd ../client
pnpm install
```

5. Run the server:
```bash
cd api
pnpm build
pnpm start
```

6. Run the client:
```bash
cd client
pnpm run dev
```

7. Check API health:
- Open [localhost:8080/api/health](localhost:8080/api/health) in your browser.

8. Login As Admin:
- Open [http://localhost:5173/admin/login](hhttp://localhost:5173/admin/login) in your browser.
- Use the following credentials:
  - Phone: `9876543210`
  - Password: `123456789`


## 4. [Documentation](#documentation)
- [API Documentation](api/README.md)
- [Client Documentation](client/README.md)

## 5. [Contributing](#contributing)
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch:
    ```bash
    git checkout -b fix/your-fix-name
    # or
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them
4. Push to your fork
5. Create a Pull Request

Please make sure your PR follows our coding standards and includes appropriate documentation.

## 6. [License](#license)
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
