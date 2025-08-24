// src/vlibot/vlibot.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import {
  object,
  string,
  number,
  boolean,
  safeParse,
  pipe,
  union,
  minLength,
  maxLength,
  startsWith,
  custom,
  transform
} from "valibot";
import { createWalletClient, http, type Hash, type Address, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

import { HinomaruDelegationAbi } from "../abis/HinomaruDelegationAbi";

// --- viem clients (test-ready singletons) ---
const RPC_URL = process.env.RPC_URL ?? "https://sepolia.base.org";
// ★テスト鍵は環境変数から。直書きは避ける
const relayAccount = privateKeyToAccount("0x47fdfc47a7f0931c6832bc97efcfab14912b3654c50cd6938cbb9625369e212e");

const walletClient = createWalletClient({
  account: relayAccount,
  chain: baseSepolia,
  transport: http(RPC_URL)
});

// ---------- valibot schemas ----------
const AddressSchema = pipe(
  string(),
  minLength(42, "Address length must be 42"),
  maxLength(42, "Address length must be 42"),
  startsWith("0x", "Address must start with 0x"),
  transform(s => s as Address)
);

const HexSchema = pipe(
  string(),
  startsWith("0x", "Hex must start with 0x"),
  transform(s => s as Hex)
);

// "123" も 123 も受けて BigInt 化
const BigIntLike = pipe(
  union([string(), number()]),
  custom(
    v => (typeof v === "string" && /^\d+$/.test(v)) || (typeof v === "number" && Number.isInteger(v) && v >= 0),
    "Expected non-negative integer (string or number)"
  ),
  transform(v => BigInt(typeof v === "number" ? v : v))
);

const CallSchema = object({
  to: AddressSchema,
  value: BigIntLike, // ← 文字列/数値→bigint
  data: HexSchema
});

const AuthorizationSchema = object({
  address: AddressSchema,
  chainId: number(),
  r: HexSchema,
  s: HexSchema,
  yParity: number(),
  nonce: number()
});

const BodySchema = object({
  from: AddressSchema,
  chainId: number(),
  authorization: AuthorizationSchema,
  call: CallSchema,
  revertOnFail: boolean(),
  value: BigIntLike
});

// ---------- Service ----------
@Injectable()
export class TestService {
  /** POST /vlibot/execute-single */
  async post(body: unknown): Promise<{ hash: Hash }> {
    const parsed = safeParse(BodySchema, body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.issues);
    }
    const data = parsed.output;

    // chainId check
    if (data.chainId !== walletClient.chain.id) {
      throw new BadRequestException("wrong chainId");
    }
    // msg.value == Σ(call.value)（invoker側でもチェックあり）
    if (data.value !== data.call.value) {
      throw new BadRequestException("bad msg.value");
    }

    try {
      // 7702: 宛先はユーザーEOA（そこに invoker が一時ロードされる）
      const hash = await walletClient.writeContract({
        abi: HinomaruDelegationAbi,
        address: data.from,
        functionName: "executeSingle",
        args: [data.call, data.revertOnFail],
        authorizationList: [data.authorization],
        value: data.value
      });

      return { hash };
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(String(e?.message ?? e));
    }
  }
}
