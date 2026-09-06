/**
 * The landing-asset bucket's view of the shared R2 client.
 *
 * Existence checks stay on the public origin — a HEAD there is free, needs no
 * credentials, and is what lets a run heal itself when the ledger and the
 * bucket disagree. Writes go through whichever backend is available: the direct
 * S3 API when R2 credentials are around (a `.env` at the repo root counts), and
 * `npx wrangler` otherwise.
 */
import { config } from "../config";
import {
  objectExists as headObject,
  selectBackend,
  type Backend,
  type BackendId,
} from "../../lib/r2";

export const bucketSpec = {
  bucket: config.bucket,
  publicOrigin: config.publicOrigin,
};

let active: Backend | undefined;

/** Called once by the CLI, after flags are parsed. */
export function useBackend(force?: BackendId) {
  active = selectBackend(bucketSpec, {
    force,
    concurrency: { s3: 16, wrangler: config.concurrency },
  });
  return active;
}

export function backend() {
  return (active ??= useBackend());
}

export const objectExists = (objectKey: string) => headObject(bucketSpec, objectKey);

export const uploadObject = (
  objectKey: string,
  filePath: string,
  contentType: string,
  cacheControl: string = config.cacheControl,
) => backend().putFile(objectKey, filePath, contentType, cacheControl);

export const deleteObject = (objectKey: string) => backend().delete(objectKey);
