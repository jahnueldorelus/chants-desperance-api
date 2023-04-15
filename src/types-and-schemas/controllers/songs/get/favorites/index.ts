import { JoiValidationResults } from "@app-types/joi-validation";

export type UserInfo = {
  userId: string;
};

export type ValidUserInfo = JoiValidationResults<UserInfo>;
