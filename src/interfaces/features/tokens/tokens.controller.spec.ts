import { describe, expect, it } from "vitest";

import { makeMockObject } from "@test/utils";

import type { TransferTokenInput, TokensService } from "@/application/services/tokens";
import type { TransferTokenEntity } from "@/domain/entities/token.entity";

import { TokensController } from "./tokens.controller";

import type { TransferTokenRequestDto } from "./tokens.dto";

describe("TokensController", () => {
  describe("transfer", () => {
    it("should return transfer token response for given request", async () => {
      // arrange
      const quoteToken =
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAHQtNcxmNMBTKSWjuES8RU5EOPROAAAAAAAAAAAAAAAAPETN3bapAPorWF3SmeA9EvpCk7wAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAKC4aZHGIYs2wdGdSi6esM42ButIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnEAAAAAAAAAAAAAAAABERERERERERERERERERERERERERAAAAAAAAAAAAAAAAX72yMVZ4r-yzZ_Ay2T9kL2QYCqMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa0nSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB27DiUgaT5vTYECU5UX--TkwrUBBTO7kiFfzrxYhMDnY.uuxljJec5RnE3BW-LAXMiGnxayQEj4zu8pgiLgW2Yxg";
      const txHash = "0xdbb0e2520693e6f4d8102539517fbe4e4c2b5010533bb92215fcebc5884c0e76";

      const mockAuthorization = {
        chainId: 1,
        address: "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29",
        nonce: 100,
        r: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        s: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        v: 27n
      } as const;

      const mockEntity: TransferTokenEntity = {
        status: "submitted",
        txHash,

        /** not exsists field */
        unknownField: "extra"
      } as TransferTokenEntity;

      const tokens = makeMockObject<TokensService>({
        transferToken(input: TransferTokenInput): Promise<TransferTokenEntity> {
          expect(input).toEqual({
            chainKey: "mainnet",
            quoteToken,
            authorization: mockAuthorization
          });

          return Promise.resolve(mockEntity);
        }
      });

      const tokensController = new TokensController(tokens);

      const dto: TransferTokenRequestDto = {
        chain: "mainnet",
        quoteToken,
        authorization: mockAuthorization
      };

      // act
      const res = await tokensController.transfer(dto);

      // assert
      expect(res).toEqual({
        status: "submitted",
        txHash
      });
    });
  });
});
