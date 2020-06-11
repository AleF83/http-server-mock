export type StringMatcher = string | string[] | RegExp;

export interface KeyValueMatcher {
  name: StringMatcher;
  value: StringMatcher;
}

export interface UrlMatcher {
  protocol?: StringMatcher;
  hostname?: StringMatcher;
  query?: StringMatcher | KeyValueMatcher[];
}

// TODO: Complete
export interface BodyMatcher<T = any> {
  mode: 'exact' | 'partial';
  partial?: Partial<T>;
}

export interface RequestMatcher<T = any> {
  url?: string | RegExp | UrlMatcher;
  headers?: { [k: string]: string } | KeyValueMatcher[];
  body?: T | BodyMatcher<T>;
}
