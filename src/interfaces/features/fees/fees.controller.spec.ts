import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { makeMockObject } from "@test/utils";

import type { EstimateFeeInput, FeesService } from "@/application/services/fees";
import type { FeeEntity } from "@/domain/entities/fee.entity";

import { FeesController } from "./fees.controller";

import type { EstimateFeeRequestDto } from "./fees.dto";

describe("FeesController", () => {
  describe("estimate", () => {
    it("should return estimated fee response for given request", async () => {
      // arrange
      const rawAddress = "0xe7c3d8c9a439fede00d2600032d5db0be71c3c29";

      const mockEntity: FeeEntity = {
        token: { symbol: "JPYC", address: rawAddress, decimals: 18 },
        feeToken: { symbol: "JPYC", address: rawAddress, decimals: 18 },
        amount: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
        fee: { symbol: "JPYC", minUnits: 100n, decimals: 18 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" },

        /** not exsists field */
        unknownField: "extra"
      } as FeeEntity;

      const fees = makeMockObject<FeesService>({
        estimateFee(input: EstimateFeeInput): Promise<FeeEntity> {
          expect(input).toEqual({
            chainKey: "mainnet",
            tokenSymbol: "JPYC",
            feeTokenSymbol: "JPYC",
            amountMinUnits: 0n
          });

          return Promise.resolve(mockEntity);
        }
      });

      const feesController = new FeesController(fees);

      const dto: EstimateFeeRequestDto = {
        chain: "mainnet",
        token: { symbol: "JPYC" },
        feeToken: { symbol: "JPYC" },
        amountMinUnits: 0n
      };

      // act
      const res = await feesController.estimate(dto);

      // assert
      expect(res).toEqual({
        token: { symbol: "JPYC", address: getAddress(rawAddress), decimals: 18 },
        feeToken: { symbol: "JPYC", address: getAddress(rawAddress), decimals: 18 },
        amount: { symbol: "JPYC", minUnits: 1000n, decimals: 18 },
        fee: { symbol: "JPYC", minUnits: 100n, decimals: 18 },
        policy: { method: "fixed_by_chain", version: "v1", chainKey: "mainnet" }
      });
    });
  });
});
