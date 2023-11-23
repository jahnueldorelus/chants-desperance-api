import { JoiValidationResults } from "@app-types/joi-validation";

export type VerifyReqHeaders = {
  "sso-token": string;
};

export type ValidReqHeaders = JoiValidationResults<VerifyReqHeaders>;
