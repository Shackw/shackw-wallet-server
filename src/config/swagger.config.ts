import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { formatUnits } from "viem";

import { ENV } from "@/config/env.config";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import {
  DELEGATE_CONTRACT_ADDRESS_REGISTORY,
  REGISTRY_CONTRACT_ADDRESS_REGISTORY
} from "@/registries/invoker.registry";
import { TOKEN_REGISTRY, Token } from "@/registries/token-chain.registry";

import { Chain, CHAIN_KEYS } from "./chain.config";

// Labels for chain names shown in Swagger (depends on environment)
const CHAIN_LABELS = {
  mainnet: "Ethereum Mainnet",
  base: "Base Mainnet",
  polygon: "Polygon PoS Mainnet",
  sepolia: "Ethereum Sepolia",
  baseSepolia: "Base Sepolia",
  polygonAmoy: "Polygon Amoy"
} as const satisfies Record<Chain, string>;

export function setupSwagger(app: INestApplication): void {
  // (3) Supported tokens and addresses (env-based)
  // Only chains that actually have an address in the registry are listed.
  const tokenAddressDesc = Object.entries(TOKEN_REGISTRY)
    .map(([symbol, meta]) => {
      const perChain = Object.entries(meta.address)
        .map(([chain, addr]) => `    - ${CHAIN_LABELS[chain as Chain]}: \`${addr}\``)
        .join("\n");

      return [`- **${symbol}**`, "  - Contract Address", perChain, `  - Decimals: ${meta.decimals}`].join("\n");
    })
    .join("\n");

  // (4) Fee policy: Fixed fee by chain & token
  // Old bps/cap schema is removed; fees are now fixed.
  const feePolicyDesc = Object.entries(FEE_REGISTORY)
    .map(([chain, tokens]) => {
      const rows = Object.entries(tokens)
        .map(([symbol, { fixedFeeAmountUnits }]) => {
          const display = formatUnits(fixedFeeAmountUnits, TOKEN_REGISTRY[symbol as Token].decimals);
          return `- ${symbol}: **Fixed Fee** = ${display} ${symbol}`;
        })
        .join("\n");
      const head = `### ${CHAIN_LABELS[chain as Chain]}`;
      return [head, rows].join("\n");
    })
    .join("\n\n");

  // (5) Minimum transferable amounts: chain × token
  const minTransferDesc = Object.entries(FEE_REGISTORY)
    .map(([chain, tokens]) => {
      const rows = Object.entries(tokens)
        .map(([symbol, { minTransferAmountUnits }]) => {
          const display = formatUnits(minTransferAmountUnits, TOKEN_REGISTRY[symbol as Token].decimals);
          return `- ${symbol}: **Minimum Transfer** = ${display} ${symbol}`;
        })
        .join("\n");
      const head = `### ${CHAIN_LABELS[chain as Chain]}`;
      return [head, rows].join("\n");
    })
    .join("\n\n");

  // (2 & 6) Networks (Delegate / Registry / Sponsor)
  const networksDesc = CHAIN_KEYS.map(chain => {
    const label = CHAIN_LABELS[chain];

    const sponsor = ENV.SPONSOR_ADDRESS;
    const delegate = DELEGATE_CONTRACT_ADDRESS_REGISTORY[chain];
    const registry = REGISTRY_CONTRACT_ADDRESS_REGISTORY[chain];

    return [
      `### ${label}`,
      `- Delegate: \`${delegate ?? "-"}\``,
      `- Registry: \`${registry ?? "-"}\``,
      `- Sponsor:  \`${sponsor ?? "-"}\``
    ].join("\n");
  }).join("\n\n");

  // (7) How to Use: Quote -> Sign Authorization -> Transfer
  // Short end-to-end flow that users can follow from the docs.
  const howToUseDesc = [
    "Follow the steps below to perform a token transfer with a fixed fee:",
    "",
    "1) **Request a quote token**",
    "   - `POST /api/quotes` with the transfer parameters.",
    "   - The response contains a `quoteToken` (opaque payload) and related metadata.",
    "",
    "2) **Sign an Authorization (EIP-7702)**",
    "   - Use viem’s `signAuthorization` to produce an authorization signature.",
    "   - Docs: https://viem.sh/docs/eip7702/signAuthorization",
    "",
    "3) **Execute the transfer**",
    "   - `POST /api/tokens:transfer` with:",
    "     - `quoteToken` returned from step 1",
    "     - `authorization` produced in step 2",
    "",
    "If the request is valid and the fee & minimum transfer checks pass, the transfer will be broadcast."
  ].join("\n");

  // Combined Markdown description
  const description = [
    "## 1. Overview",
    "The **Hinomaru Wallet API** provides endpoints for stablecoin-based transactions and fee estimation.",
    "It is built on **Account Abstraction (EIP-7702)** and focuses on secure, low-volatility payments.",
    "",
    "## 2. Supported Chains",
    Object.values(CHAIN_LABELS)
      .filter(Boolean)
      .map(v => `- ${v}`)
      .join("\n"),
    "",
    "## 3. Supported Tokens and Addresses",
    tokenAddressDesc,
    "",
    "## 4. Fee Policy (Fixed Fee)",
    "Transaction fee is **fixed per chain and token**.",
    "",
    feePolicyDesc,
    "",
    "## 5. Minimum Transferable Amounts",
    "Minimum transferable amounts are **defined per chain and token**.",
    "",
    minTransferDesc,
    "",
    "## 6. Contract Addresses (Delegate / Registry / Sponsor)",
    networksDesc,
    "",
    "## 7. How to Use",
    howToUseDesc
  ].join("\n");

  const config = new DocumentBuilder()
    .setTitle("Hinomaru Wallet API")
    .setDescription(description)
    .addServer("https://wallet.ficklewolf.com/")
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    useGlobalPrefix: true
  });
}
