import * as v from "valibot";
import { isAddress } from "viem";

const ethereumAddressValidator = v.custom<string>(
  (value): value is string => typeof value === "string" && isAddress(value),
  () => "Invalid Ethereum address"
);

const privateKeyValidator = v.custom<string>(
  (value): value is string => typeof value === "string" && /^0x[0-9a-fA-F]{64}$/.test(value),
  () => "Invalid Ethereum private key"
);

export const EnvSchema = v.object({
  NODE_ENV: v.union([v.literal("dev"), v.literal("prd")]),
  CHAIN_ID: v.pipe(
    v.string(),
    v.transform(s => Number(s))
  ),
  CHAIN_NAME: v.string(),
  RPC_PROVIDER: v.pipe(v.string(), v.url()),
  BUNDLER_PK: v.pipe(v.string(), privateKeyValidator),
  ENTRY_POINT_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  JPYC_PAYMASTER_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  USDC_PAYMASTER_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  EURC_PAYMASTER_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  JPYC_SIGNER_PK: v.pipe(v.string(), privateKeyValidator),
  USDC_SIGNER_PK: v.pipe(v.string(), privateKeyValidator),
  EURC_SIGNER_PK: v.pipe(v.string(), privateKeyValidator)
});

export type EnvModel = v.InferOutput<typeof EnvSchema>;
