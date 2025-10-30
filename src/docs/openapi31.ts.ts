import { toJsonSchema } from "@valibot/to-json-schema";

import { EstimateFeeDtoSchemaBase } from "@/v1/dtos/fees.dto";
import { CreateQuoteDtoSchemaBase } from "@/v1/dtos/quotes.dto";
import { TransferTokenDtoSchema } from "@/v1/dtos/token.dto";

import { FeeModelDocSchema } from "./schemas/fee-model.doc.schema";
import { QuoteModelDocSchema } from "./schemas/quote-model.doc.schema";
import { TransferTokenModelDocSchema } from "./schemas/token-model.doc.schema";

export const openapi31 = {
  openapi: "3.1.0",
  info: {
    title: "Hinomaru Wallet API",
    version: "0.0.1",
    description: [
      "This API focuses on **JPUC, USDC, EURC**.",
      "Built around **Account Abstraction (EIP-7702)**.",
      "DeFi / Lending: under development.",
      "",
      "### Ethereum Mainnet",
      "- Delegation: `0xb820D66Ba5501232a3CF4a00FdF9e3f0e5eCE85C`",
      "- Registry:   `0xaf264eaB8D01A54F064Ee17951aA6b6f3836DC26`",
      "",
      "### Ethereum Sepolia",
      "- Delegation: `0x160ce681bfe7AFfC6aB5A4034b68d526CD178C00`",
      "- Registry:   `0xA30E5b7a152DD4B7b31838B3e81665D0D99dBe69`",
      "",
      "### Base Mainnet",
      "- Delegation: `0x9C928a2CD9FD82e84dB006db7c917012ffB56C33`",
      "- Registry:   `0x30F8bf6e250DA7D2D7FCC50e0AA57d8f29b500Cd`",
      "",
      "### Base Sepolia",
      "- Delegation: `0x1997f7094560eF4B0D8a466CA06619B41C68B14B`",
      "- Registry:   `0x0e8B61d5abB89197fC098E3133fbC351d09A105c`"
    ].join("\n")
  },
  servers: [
    { url: "https://wallet.ficklewolf.com/", description: "Main (Ethereum & Base Mainnet)" },
    { url: "https://dev.wallet.ficklewolf.com/", description: "Test (Sepolia & Base Sepolia)" }
  ],
  tags: [{ name: "fees" }, { name: "quotes" }, { name: "tokens" }],
  components: {
    schemas: {
      EstimateFeeDto: toJsonSchema(EstimateFeeDtoSchemaBase, { typeMode: "input", errorMode: "ignore" }),
      FeeModel: toJsonSchema(FeeModelDocSchema, { typeMode: "input", errorMode: "ignore" }),
      CreateQuoteDto: toJsonSchema(CreateQuoteDtoSchemaBase, { typeMode: "input", errorMode: "ignore" }),
      QuoteModel: toJsonSchema(QuoteModelDocSchema, { typeMode: "input", errorMode: "ignore" }),
      TransferTokenDto: toJsonSchema(TransferTokenDtoSchema, { typeMode: "input", errorMode: "ignore" }),
      TransferTokenModel: toJsonSchema(TransferTokenModelDocSchema, { typeMode: "input", errorMode: "ignore" })
    }
  },
  paths: {
    "/api/v1/fees:estimate": {
      post: {
        operationId: "estimateFee",
        summary: "Estimate transaction fee",
        description: "Estimate the required fee for a delegated account (EIP-7702) transaction.",
        tags: ["fees"],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/EstimateFeeDto" } }
          }
        },
        responses: {
          "200": {
            description: "Estimated fee",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/FeeModel" } }
            }
          },
          "400": { description: "Validation error" },
          "500": { description: "Internal server error" }
        }
      }
    },

    "/api/v1/quotes": {
      post: {
        operationId: "createQuote",
        summary: "Create transfer quote",
        description: "Create a quote for a token transfer including fee policy and call hash.",
        tags: ["quotes"],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateQuoteDto" } }
          }
        },
        responses: {
          "200": {
            description: "Quote created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/QuoteModel" } }
            }
          },
          "400": { description: "Validation error" },
          "500": { description: "Internal server error" }
        }
      }
    },

    "/api/v1/tokens:transfer": {
      post: {
        operationId: "transferToken",
        summary: "Transfer tokens",
        description: "Submit a token transfer using delegated account flow.",
        tags: ["tokens"],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/TransferTokenDto" } }
          }
        },
        responses: {
          "200": {
            description: "Transfer submitted",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/TransferTokenModel" } }
            }
          },
          "400": { description: "Validation error" },
          "500": { description: "Internal server error" }
        }
      }
    }
  }
} as const;
