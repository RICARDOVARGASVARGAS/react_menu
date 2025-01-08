// src/utils/extractUUID.js
export const extractUUID = (url) =>
  url.match(
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
  )?.[0];
