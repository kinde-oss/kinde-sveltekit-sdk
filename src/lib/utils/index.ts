export const pick = (target: Record<string, unknown>, path: string[]) => {
  return Object.keys(target).reduce(
    (prev, curr) => {
      if (path.includes(curr)) {
        prev[curr] = target[curr];
      }
      return prev;
    },
    {} as Record<string, unknown>,
  );
};

export const omit = (target: Record<string, unknown>, path: string[]) => {
  return Object.keys(target).reduce(
    (prev, curr) => {
      if (path.includes(curr)) {
        delete prev[curr];
      }
      return prev;
    },
    { ...target },
  );
};

const rootParams = [
  "start_page",
  "is_create_org",
  "response_type",
  "org_name",
  "org_code",
  "state",
  "post_login_redirect_url",
  "authUrlParams",
  "redirect_url",
];

export const parseSearchParamsToObject = (search: string) => {
  const searchParams = new URLSearchParams(search);
  let paramsObject: Record<string, string | number | Record<string, unknown>> =
    {};

  for (const param of searchParams.entries()) {
    paramsObject[param[0]] = param[1];
  }
  paramsObject.authUrlParams = { ...paramsObject };

  paramsObject = pick(paramsObject, rootParams) as Record<
    string,
    string | number
  >;
  paramsObject.authUrlParams = omit(
    paramsObject.authUrlParams as Record<string, unknown>,
    rootParams,
  );

  if (Object.keys(paramsObject.authUrlParams).length === 0) {
    delete paramsObject.authUrlParams;
  }

  return paramsObject;
};
