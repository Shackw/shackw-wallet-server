// src/configs/swagger.config.ts
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ENV } from "@/config/env.config";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY, Token } from "@/registries/token.registry";
import { toDisplayValue } from "@/shared/helpers/token-units.helper";

export function setupSwagger(app: INestApplication): void {
  const isProd = ENV.NODE_ENV === "prd";

  // --- (3) Supported tokens and addresses (env-based) ---
  const tokenAddressDesc = Object.entries(TOKEN_REGISTRY)
    .map(([symbol, meta]) => {
      const mainAddr = meta.address.main;
      const baseAddr = meta.address.base;
      return [
        `- **${symbol}**`,
        `  - ${isProd ? "Ethereum Mainnet" : "Ethereum Sepolia"}: \`${mainAddr}\``,
        `  - ${isProd ? "Base Mainnet" : "Base Sepolia"}: \`${baseAddr}\``,
        `  - Decimals: ${meta.decimals}`
      ].join("\n");
    })
    .join("\n");

  // --- (4) Fee policy per chain and token ---
  const feePolicyDesc = Object.entries(FEE_REGISTORY)
    .map(([chain, tokens]) => {
      const lines = Object.entries(tokens)
        .map(
          ([symbol, { bps, capUnits, quantumUnits }]) =>
            `- ${symbol}: bps = ${bps}, cap = \`${capUnits.toString()}\` units, quantum = \`${quantumUnits.toString()}\``
        )
        .join("\n");
      return [`[${ENV.NODE_ENV === "prd" ? chain.toUpperCase() : `${chain}-sepolia`}]`, lines].join("\n");
    })
    .join("\n\n");

  // --- (5) Minimum transferable amounts ---
  const minTransferDesc = Object.entries(TOKEN_REGISTRY)
    .map(([symbol, meta]) => `- ${symbol}: ${toDisplayValue(meta.minTransferAmountUnits, symbol as Token)} ${symbol}`)
    .join("\n");

  // --- (2 & 6) Networks (Delegate / Registry) ---
  const networksDesc = [
    `### ${isProd ? "Ethereum Mainnet" : "Ethereum Sepolia"}`,
    `- Delegate: \`${ENV.MAIN_DELEGATE_ADDRESS}\``,
    `- Registry: \`${ENV.MAIN_REGISTRY_ADDRESS}\``,
    `- Sponsor:  \`${ENV.SPONSOR_ADDRESS}\``,
    "",
    `### ${isProd ? "Base Mainnet" : "Base Sepolia"}`,
    `- Delegate: \`${ENV.BASE_DELEGATE_ADDRESS}\``,
    `- Registry: \`${ENV.BASE_REGISTRY_ADDRESS}\``,
    `- Sponsor:  \`${ENV.SPONSOR_ADDRESS}\``
  ].join("\n");

  // --- (1–6) Combined Markdown description ---
  const description = [
    "## 1. Overview",
    "The **Hinomaru Wallet API** provides endpoints for stablecoin-based transactions and fee estimation.",
    "It is built on **Account Abstraction (EIP-7702)**, designed to simplify secure and low-volatility payments.",
    "",
    "## 2. Supported Chains",
    isProd ? "- Ethereum Mainnet\n- Base Mainnet" : "- Ethereum Sepolia (Testnet)\n- Base Sepolia (Testnet)",
    "",
    "## 3. Supported Tokens and Addresses",
    tokenAddressDesc,
    "",
    "## 4. Fee Policy",
    "Transaction fees are defined per chain and token, expressed in **basis points (bps)** with a maximum cap.",
    "",
    feePolicyDesc,
    "",
    "## 5. Minimum Transferable Amounts",
    minTransferDesc,
    "",
    "## 6. Contract Addresses (Delegate / Registry)",
    networksDesc
  ].join("\n");

  const config = new DocumentBuilder()
    .setTitle("Hinomaru Wallet API")
    .setDescription(description)
    .addServer(
      isProd ? "https://wallet.ficklewolf.com/" : "https://dev.wallet.ficklewolf.com/",
      isProd ? "Main (Ethereum & Base Mainnet)" : "Test (Sepolia & Base Sepolia)"
    )
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    useGlobalPrefix: true
  });
}
