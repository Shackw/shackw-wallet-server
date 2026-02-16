import { timingSafeEqual } from "crypto";

import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha2";
import { encodeAbiParameters, decodeAbiParameters, hexToBytes, bytesToHex } from "viem";

import { ApplicationError } from "@/application/errors";
import type { QuoteTokenValueObject } from "@/domain/value-objects/quote-token.value-object";

import { QUOTE_TOKEN_ENCODING_TYPES } from "./quote-token.encoding";

import type { Hex } from "viem";

const toB64u = (u8: Uint8Array) => Buffer.from(u8).toString("base64url");
const fromB64u = (s: string) => new Uint8Array(Buffer.from(s, "base64url"));

export function encodeQuoteToken(p: QuoteTokenValueObject, secret: Hex): string {
  const encodedHex = encodeAbiParameters(QUOTE_TOKEN_ENCODING_TYPES as any, [
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

export function decodeQuoteToken(quoteToken: string, secret: Hex): QuoteTokenValueObject {
  const [p64, m64] = quoteToken.split(".");
  if (!p64 || !m64) {
    throw new ApplicationError({
      code: "QUOTE_TOKEN_MALFORMED",
      message: "Malformed quoteToken."
    });
  }

  const payloadBytes = fromB64u(p64);
  const mac = fromB64u(m64);
  const expected = hmac(sha256, hexToBytes(secret), payloadBytes);

  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) {
    throw new ApplicationError({
      code: "QUOTE_TOKEN_MAC_INVALID",
      message: "Invalid quoteToken MAC."
    });
  }

  const decoded = decodeAbiParameters(QUOTE_TOKEN_ENCODING_TYPES, bytesToHex(payloadBytes));
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

  if (v !== 1)
    throw new ApplicationError({
      code: "QUOTE_TOKEN_UNSUPPORTED_VERSION",
      message: `Unsupported quoteToken version: v=${v}.`
    });

  return {
    v,
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
