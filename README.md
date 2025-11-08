# Hinomaru Wallet API
Wallet-to-Wallet stablecoin transfers using **Account Abstraction (EIP-7702)**

This API powers **Hinomaru Wallet**, a stablecoin-focused payment system designed to enable **low-volatility, gas-abstracted transfers** over supported EVM chains.

This document describes the **environment-agnostic API architecture**, including the supported concepts, endpoints, request flow, and usage guidelines.

---

# 1. Overview

The **Hinomaru Wallet API** provides:

- Stablecoin transfers with fixed per-chain transaction fees
- EIP-7702–based authorization signing (no private key exposure to backend)
- Token metadata, fee metadata, and contract metadata endpoints
- Quote → Authorization → Transfer execution flow
- Server-side validation of minimum transferable amounts and fixed fees

The backend does **not** store user private keys.
Authorization is signed locally by the user wallet and verified on-chain via EIP-7702 delegation.

---

# 2. Supported Concepts

## 2.1 Supported Tokens
The API supports multiple stablecoins.
Each token definition includes:

- `symbol`
- `decimals`
- `address[chain]`
- `fixedFeeAmountUnits[chain]`
- `minTransferAmountUnits[chain]`

Token availability may differ per chain, but the API exposes this dynamically at:

```
GET /meta/tokens
```

---

## 2.2 Supported Chains
Supported chains vary per environment (Testnet / Mainnet), but the API exposes available chains and contracts dynamically via:

```
GET /meta/contracts
GET /meta/fees
GET /meta/min-transfer
```

---

# 3. Fixed Fee Policy

The Hinomaru Wallet API uses **fixed fees per chain and token**.
Each fee entry includes:

- `symbol`
- `chain`
- `fixedFeeAmountUnits`
- `fixedFeeAmountDisplay`

Clients use:

```
GET /meta/fees
```

to retrieve the applicable fee table.

---

# 4. Minimum Transfer Amounts

Transfers must satisfy a **minimum token amount**, defined per chain and token.

Example fields:

- `symbol`
- `chain`
- `minUnits`
- `display`

Retrieve via:

```
GET /meta/min-transfer
```

---

# 5. Contract Addresses

The API exposes the contract addresses used for:

- Delegation Contract (EIP-7702)
- Registry Contract
- Sponsor Contract

Retrieve via:

```
GET /meta/contracts
```

These values differ between environments and are **intentionally not hard-coded in this README**.

---

# 6. Metadata Endpoints

The `/meta` endpoints provide all chain- and token-dependent metadata:

| Endpoint | Description |
|---------|-------------|
| `GET /meta/summary` | Full metadata bundle (tokens, fees, min-transfer, contracts) |
| `GET /meta/tokens` | Supported tokens and their addresses |
| `GET /meta/fees` | Fixed fees per chain & token |
| `GET /meta/min-transfer` | Minimum transferable amounts |
| `GET /meta/contracts` | Delegate / Registry / Sponsor addresses |

These responses are environment-dependent but **require no environment information in the README**.

---

# 7. How to Use (End-to-End Flow)

This is the core flow for performing a **token transfer with fixed fee** using Hinomaru Wallet + EIP-7702.

---

## **Step 1 — Request a Quote Token**

Call:

```
POST /api/quotes
```

with the parameters:

- `chain`
- `token.symbol`
- `amountMinUnits`
- `sender`
- `recipient`

The API returns a **quoteToken**, which is a signed piece of data required for the final transfer.

Example fields returned:

- `quoteToken` (opaque string)
- `chain`
- `token`
- `feeToken`
- `fee`
- `expiresAt`

---

## **Step 2 — Sign Authorization (EIP-7702)**

Use **viem**’s `signAuthorization` to produce an authorization signature:

Docs:
https://viem.sh/docs/eip7702/signAuthorization

The authorization binds:

- delegated account
- expiry
- allowed call(s)
- nonce
- chain
- wallet address

This signature **never reaches the backend** until the user explicitly submits the transfer.

---

## **Step 3 — Execute the Transfer**

Call:

```
POST /api/tokens:transfer
```

with:

- `quoteToken` (from Step 1)
- `authorization` (from Step 2)

If:

- quote is valid
- EIP-7702 signature is valid
- minimum transfer amount is satisfied
- the sender has sufficient balance for the fixed fee

…then the server relays the transaction.

---

# 8. Error Handling

The API uses structured exceptions such as:

- `BadRequestWithCodeException`
- `ChainMismatch`
- `InsufficientFeeBalance`
- `MinTransferAmountViolation`
- `TokenBalanceFetchFailed`

Errors always include:

- machine-readable code
- human-readable message

---

# 9. Security Notes

- User private keys are never sent to the backend.
- Signing uses EIP-7702 Authorization Messages.
- Backend does not hold or issue keys; it only verifies authorizations.
- All fee and minimum transfer validation is performed server-side.

---

# 10. Development Notes

- All chain- and environment-dependent values (addresses, decimals, fees) should be retrieved via `/meta/**`, not hardcoded.
- This README intentionally avoids embedding environment-specific constants.

---

# 11. License

Internal use only unless otherwise specified.


## Author

**FickleWolf**