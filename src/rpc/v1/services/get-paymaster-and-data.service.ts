import { Address, createPublicClient, Hex, http, keccak256 } from "viem";

import { EntryPointAbi } from "../constants/abis/entryPointAbi";
import { RpcRequest } from "../schema/rpc.schema";

export class GetPaymasterAndDataService {
  constructor(
    private readonly cfg: {
      rpcUrl: string;
      chainId: number;
      paymaster: Address;
      trustedSignerPk: Hex;
    }
  ) {}

  // TODO DIする
  private get client() {
    return createPublicClient({
      chain: {
        id: this.cfg.chainId,
        name: "custom",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [this.cfg.rpcUrl] } }
      },
      transport: http(this.cfg.rpcUrl)
    });
  }

  async prepare(
    input: Extract<RpcRequest, { method: "pm_preparePaymasterAndData" }>["params"]["0"]
  ): Promise<PrepareOutput> {
    const { userOperation, entryPoint, amount, validAfter, validUntil } = input;

    // --- 1) userOpHash（EntryPoint.getUserOpHash に準拠）
    // ⚠ 後で検証して必要なら「署名用ハッシュ」の定義を調整する
    const userOpForHash = {
      ...userOperation,
      paymasterAndData: "0x" as Hex // いったん空（循環問題は後で要調整）
    };

    const userOpHash = await this.client.readContract({
      address: entryPoint,
      abi: EntryPointAbi,
      functionName: "getUserOpHash",
      args: [userOpForHash]
    });

    // --- 2) 署名プレイロード
    const packed = this.packForSigning(userOpHash, validUntil, validAfter, amount);
    const digest = keccak256(packed);

    // --- 3) 署名（Eth Signed Message）
    const account = privateKeyToAccount(this.cfg.trustedSignerPk);
    const signature = await account.signMessage({ message: { raw: digest } });

    // --- 4) paymasterAndData の ABI エンコード
    const encoded = encodeAbiParameters(
      [
        { name: "validUntil", type: "uint48" },
        { name: "validAfter", type: "uint48" },
        { name: "amount", type: "uint256" },
        { name: "sig", type: "bytes" }
      ],
      [BigInt(validUntil), BigInt(validAfter), amount, signature as Hex]
    ) as Hex;

    const paymasterAndData = (this.cfg.paymaster + (encoded as string).slice(2)) as Hex;

    return { paymasterAndData, signature: signature as Hex, validAfter, validUntil };
  }

  private packForSigning(userOpHash: Hex, validUntil: number, validAfter: number, amount: bigint): Hex {
    // abi.encodePacked(bytes32, uint48, uint48, uint256)
    // viem の encodePacked を使ってもOK。ここは手堅く encodeAbiParameters→keccak でもいい。
    return encodeAbiParameters(
      [
        { name: "userOpHash", type: "bytes32" },
        { name: "validUntil", type: "uint48" },
        { name: "validAfter", type: "uint48" },
        { name: "amount", type: "uint256" }
      ],
      [userOpHash, BigInt(validUntil), BigInt(validAfter), amount]
    ) as Hex;
  }
}
