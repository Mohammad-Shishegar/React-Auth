import crypto from "node:crypto";

export const generateToken = () => {
  return crypto.randomUUID();
};
