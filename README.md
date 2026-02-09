# Shackw Wallet API

Wallet-to-Wallet stablecoin transfers using **Account Abstraction (EIP-7702)**

This API powers **Shackw Wallet**, a stablecoin-focused payment system designed to enable
**low-volatility, gas-abstracted transfers** over supported EVM chains.

This document describes the **API architecture and design principles**,
focusing on concepts, responsibilities, and security boundaries rather than
concrete endpoint specifications.

---

# 1. Overview

The **Shackw Wallet API** provides:

- Stablecoin transfers with fixed, predictable transaction fees
- EIP-7702–based authorization (no private key exposure to backend)
- Dynamic exposure of chain-, token-, and fee-dependent metadata
- A quote → authorization → execution transfer model
- Server-side validation for fees and minimum transferable amounts

The backend does **not** store user private keys.
All authorizations are signed locally by the user wallet and verified on-chain
via EIP-7702 delegation.

---

# 2. Core Concepts

## 2.1 Stablecoin-Centric Design

The API is designed exclusively for **stablecoin transfers**.
Volatile assets and native gas tokens are intentionally excluded.

Each supported token is defined by:

- `symbol`
- `decimals`
- contract address per chain
- fixed fee per chain
- minimum transferable amount per chain

Token availability may differ per chain and environment, but all information is
exposed dynamically via metadata endpoints.

---

## 2.2 Chain and Environment Abstraction

The API avoids hardcoding chain- or environment-specific values.

Instead:

- Supported chains
- Contract addresses
- Fixed fees
- Minimum transfer amounts

are all retrieved dynamically through metadata endpoints.

This allows clients to remain environment-agnostic while relying on the server
as the source of truth.

---

# 3. Fixed Fee Policy

The Shackw Wallet API uses **fixed fees per chain and token**.

Key characteristics:

- Fees are deterministic and known in advance
- No gas estimation is required on the client side
- Fee values are validated server-side before execution

Clients retrieve fee information via metadata endpoints rather than hardcoding
values locally.

---

# 4. Minimum Transfer Amounts

Each chain and token combination defines a **minimum transferable amount**.

This prevents:

- Dust transfers
- Transfers that cannot safely cover fixed fees
- UX inconsistencies caused by near-zero balances

Minimum values are enforced server-side and exposed via metadata endpoints for
client-side validation.

---

# 5. Contract Address Exposure

The API exposes the contract addresses used for:

- Delegation (EIP-7702)
- Registry
- Sponsor / relayer logic

These values differ by chain and environment and are **intentionally not embedded**
in this document.

Clients are expected to retrieve all contract addresses dynamically from metadata
endpoints.

---

# 6. Metadata Endpoints

The `/meta` endpoints expose all environment- and chain-dependent information.

| Endpoint | Description |
|---------|-------------|
| `GET /meta/summary` | Full metadata bundle |
| `GET /meta/tokens` | Supported tokens and addresses |
| `GET /meta/fees` | Fixed fees per chain and token |
| `GET /meta/min-transfer` | Minimum transferable amounts |
| `GET /meta/contracts` | Delegate / Registry / Sponsor addresses |

This design ensures that clients never rely on hardcoded constants.

---

# 7. Transfer Flow (Conceptual)

Token transfers follow a three-step conceptual flow:

1. **Quote issuance**  
   The server issues a signed, time-limited quote describing the intended transfer.

2. **Client-side authorization signing**  
   The user wallet signs an EIP-7702 authorization binding the allowed call,
   expiry, nonce, chain, and wallet address.

3. **Transaction relay and execution**  
   The server verifies the quote and authorization, then relays the transaction
   on-chain.

Concrete endpoint names and request formats are intentionally omitted from this
document.

---

# 8. Security Notes

- User private keys are never sent to the backend
- Authorization uses EIP-7702 messages signed by the user wallet
- The backend only verifies authorizations and relays transactions
- Fee and minimum transfer validation is enforced server-side

The API is designed so that the backend cannot act on behalf of users without
explicit, cryptographically signed authorization.

---

# 9. Development Notes

- All chain-, token-, and environment-dependent values must be retrieved via
  metadata endpoints
- Clients should not embed contract addresses, decimals, or fee values
- This document intentionally avoids environment-specific constants to prevent
  accidental desynchronization

---

# 10. License

This repository is provided for reference purposes only.

No license is granted for use, modification, or redistribution
unless explicitly stated otherwise.

---

## Author

**Shackw**
