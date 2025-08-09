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

export const EnvironmentSchema = v.object({
  ADMIN_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  PRIVATE_KEY: v.pipe(v.string(), privateKeyValidator),
  ENTRY_POINT_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  PAYMASTER_ADDRESS: v.pipe(v.string(), ethereumAddressValidator),
  RPC_PROVIDER: v.pipe(v.string(), v.url())
});

export type EnvironmentModel = v.InferOutput<typeof EnvironmentSchema>;
