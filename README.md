# Shackw Wallet API

Transaction relay server for fixed-fee stablecoin transfers via EIP-7702 authorization.

Built with NestJS.

---

## Overview

- Stablecoin-only (JPYC / USDC)
- Fixed, predictable fees per chain and token
- EIP-7702–based authorization (private keys never sent to backend)
- Quote-driven transfer flow: quote → authorization → relay

---

## Transfer Flow

1. Client requests a quote from the server
2. User wallet signs an EIP-7702 authorization locally
3. Client submits quote + authorization to the server
4. Server verifies and relays the transaction on-chain

---

## Security

- User private keys are never sent to the backend
- Authorizations are EIP-7702 messages signed by the user wallet
- Fee and minimum transfer validation is enforced server-side
- The backend cannot act on behalf of users without explicit signed authorization

---

## Author

**Shackw**