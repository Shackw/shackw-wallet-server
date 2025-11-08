import * as v from "valibot";

import { addressValidator } from "../rules/address.validator";

export const TransferAddressValidator = v.object(
  {
    sender: addressValidator("sender"),
    recipient: addressValidator("recipient")
  },
  issue => `${issue.expected} is required`
);
