import * as v from "valibot";

import type { FeeEntity } from "@/domain/entities/fee.entity";

import { EstimateFeeResponseDtoSchema } from "./fees.dto";

import type { EstimateFeeResponseDto } from "./fees.dto";

export const toEstimateFeeResponseDto = (entity: FeeEntity): EstimateFeeResponseDto => {
  return v.parse(EstimateFeeResponseDtoSchema, entity);
};
