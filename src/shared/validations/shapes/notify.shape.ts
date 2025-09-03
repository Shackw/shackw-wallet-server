import * as v from "valibot";

import { isHttpsPublicUrl } from "@/helpers/url.helper";

export const notifyWebhookShape = v.object(
  {
    id: v.pipe(
      v.string("webhook.id must be a string."),
      v.minLength(1, "webhook.id must not be empty."),
      v.maxLength(64, "webhook.id is too long."),
      v.regex(/^[A-Za-z0-9:_-]+$/, "webhook.id has invalid chars.")
    ),
    url: v.pipe(
      v.string("webhook.url must be a string."),
      v.url("webhook.url must be a url."),
      v.check(isHttpsPublicUrl, "webhook.url must be HTTPS and public (no localhost/private ranges).")
    ),
    echo: v.pipe(
      v.string("webhook.echo must be a string."),
      v.minLength(16, "webhook.echo must be at least 16 chars."),
      v.maxLength(128, "webhook.echo is too long."),
      v.regex(/^[A-Za-z0-9_-]+$/, "webhook.echo must be base64url-ish.")
    )
  },
  "notify.webhook must be an object. Required fields: id, url, echo"
);
export type NotifyWebhook = v.InferOutput<typeof notifyWebhookShape>;

export const notifyShape = v.object({
  webhook: notifyWebhookShape
});
export type Notify = v.InferOutput<typeof notifyShape>;
