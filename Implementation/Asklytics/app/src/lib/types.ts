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
  createTime: string; // You can also use `Date` if you want to work with Date objects
  updateTime: string; // Similarly, `Date` is an option here too
  displayName: string;
  regionCode: string;
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
