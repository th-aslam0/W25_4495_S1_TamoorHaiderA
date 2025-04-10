export type GoogleLoginPropsType = {
  googleLogin: () => void;
};

export type User = {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
};

export type Account = {
  name: string;
  createTime: string;
  updateTime: string;
  displayName: string;
  regionCode: string;
};

export type Property = {
  name: string;
  parent: string;
  createTime: string;
  updateTime: string;
  displayName: string;
  industryCategory: string;
  timeZone: string;
  currencyCode: string;
  serviceLevel: string;
  account: string;
  propertyType: string;
};

export type Step = {
  name: string;
  result: Record<string, string | undefined>;
};

export type ChatOutput = {
  question: string;
  steps: Step[];
  result: {
    answer: string;
    tools_used: string[];
  };
};
