import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { formatUnits } from "viem";

import { ENV } from "@/config/env.config";
import { FEE_REGISTORY } from "@/registries/fee.registry";
import { TOKEN_REGISTRY, Token } from "@/registries/token-chain.registry";

// Labels for chain names shown in Swagger (depends on environment)
const CHAIN_LABELS = {
  prod: {
    main: "Ethereum Mainnet",
    base: "Base Mainnet",
    polygon: "Polygon PoS Mainnet"
  },
  dev: {
    main: "Ethereum Sepolia",
    base: "Base Sepolia",
    polygon: "Polygon Amoy"
  }
} as const;

export function setupSwagger(app: INestApplication): void {
  const isProd = ENV.NODE_ENV === "prd";
  const labels = isProd ? CHAIN_LABELS.prod : CHAIN_LABELS.dev;

  // (3) Supported tokens and addresses (env-based)
  // Only chains that actually have an address in the registry are listed.
  const tokenAddressDesc = Object.entries(TOKEN_REGISTRY)
    .map(([symbol, meta]) => {
      const perChain = Object.entries(meta.address)
        .map(([chain, addr]) => `  - ${labels[chain as keyof typeof labels]}: \`${addr}\``)
        .join("\n");

      return [`- **${symbol}**`, perChain, `  - Decimals: ${meta.decimals}`].join("\n");
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
      const head = `### ${labels[chain as keyof typeof labels]}`;
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
      const head = `### ${labels[chain as keyof typeof labels]}`;
      return [head, rows].join("\n");
    })
    .join("\n\n");

  // (2 & 6) Networks (Delegate / Registry / Sponsor)
  const networksDesc = [
    `### ${labels.main}`,
    `- Delegate: \`${ENV.MAIN_DELEGATE_ADDRESS}\``,
    `- Registry: \`${ENV.MAIN_REGISTRY_ADDRESS}\``,
    `- Sponsor:  \`${ENV.SPONSOR_ADDRESS}\``,
    "",
    `### ${labels.base}`,
    `- Delegate: \`${ENV.BASE_DELEGATE_ADDRESS}\``,
    `- Registry: \`${ENV.BASE_REGISTRY_ADDRESS}\``,
    `- Sponsor:  \`${ENV.SPONSOR_ADDRESS}\``,
    ...(labels.polygon
      ? [
          "",
          `### ${labels.polygon}`,
          `- Delegate: \`${ENV.POLYGON_DELEGATE_ADDRESS ?? "-"}\``,
          `- Registry: \`${ENV.POLYGON_REGISTRY_ADDRESS ?? "-"}\``,
          `- Sponsor:  \`${ENV.SPONSOR_ADDRESS}\``
        ]
      : [])
  ].join("\n");

  // Combined Markdown description
  const description = [
    "## 1. Overview",
    "The **Hinomaru Wallet API** provides endpoints for stablecoin-based transactions and fee estimation.",
    "It is built on **Account Abstraction (EIP-7702)** and focuses on secure, low-volatility payments.",
    "",
    "## 2. Supported Chains",
    Object.values(labels)
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
