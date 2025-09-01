import { timingSafeEqual } from "crypto";

import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha2";
import { encodeAbiParameters, decodeAbiParameters, hexToBytes, bytesToHex, type Address, type Hex } from "viem";

import { QUOTE_TOKEN_TYPES } from "../encodings/quote-token.abi";
import { QuoteToken } from "../types/quote-token.type";

const toB64u = (u8: Uint8Array) => Buffer.from(u8).toString("base64url");
const fromB64u = (s: string) => new Uint8Array(Buffer.from(s, "base64url"));

export function encodeQuoteToken(p: QuoteToken, secret: Hex): string {
  const encodedHex = encodeAbiParameters(QUOTE_TOKEN_TYPES as any, [
    p.v,
    BigInt(p.chainId),
    p.sender,
    p.recipient,
    p.token,
    p.feeToken,
    p.amountMinUnits,
    p.feeMinUnits,
    p.delegate,
    p.sponsor,
    p.expiresAt,
    p.nonce,
    p.callHash
  ]);

  const payloadBytes = hexToBytes(encodedHex);
  const keyBytes = hexToBytes(secret);

  const mac = hmac(sha256, keyBytes, payloadBytes);
  return `${toB64u(payloadBytes)}.${toB64u(mac)}`;
}

export function decodeQuoteToken(quoteToken: string, secret: Hex): QuoteToken {
  const [p64, m64] = quoteToken.split(".");
  if (!p64 || !m64) throw new Error("MALFORMED_QUOTE_TOKEN");

  const payloadBytes = fromB64u(p64);
  const mac = fromB64u(m64);
  const expected = hmac(sha256, hexToBytes(secret), payloadBytes);

  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) {
    throw new Error("INVALID_QUOTE_TOKEN_MAC");
  }

  const decoded = decodeAbiParameters(QUOTE_TOKEN_TYPES, bytesToHex(payloadBytes)) as unknown as [
    bigint,
    bigint,
    Address,
    Address,
    Address,
    Address,
    bigint,
    bigint,
    Address,
    Address,
    bigint,
    bigint,
    Hex
  ];

  const [
    v,
    chainId,
    sender,
    recipient,
    token,
    feeToken,
    amountMinUnits,
    feeMinUnits,
    delegate,
    sponsor,
    expiresAt,
    nonce,
    callHash
  ] = decoded;

  return {
    v: Number(v),
    chainId: Number(chainId),
    sender,
    recipient,
    token,
    feeToken,
    amountMinUnits,
    feeMinUnits,
    delegate,
    sponsor,
    expiresAt,
    nonce,
    callHash
  };
}
