import { z } from 'zod';

const APIIssuesSchema = z.object({ code: z.number(), detail: z.string(), field: z.string() });
type APIIssues = z.infer<typeof APIIssuesSchema>;

const TokenSchema = z.string();
type Token = z.infer<typeof TokenSchema>;

const ItemSchema = z.object({
  id: z.string().uuid(),
  type: z.number(),
  file: z.string().url(),
  frameType: z.number(),
  positionX: z.number(),
  positionY: z.number(),
  positionZ: z.number(),
  rotationX: z.number(),
  rotationY: z.number(),
  rotationZ: z.number(),
  scale: z.number(),
});

export const SpaceSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  userNickname: z.string(),
  profileImgURL: z.nullable(z.string().url()),
  thumbImage: z.nullable(z.string().url()),
  items: z.array(ItemSchema),
  description: z.string(),
  hashTags: z.array(z.string()),
  noHashTagDescription: z.string(),
  likeNum: z.number(),
  isLike: z.boolean(),
  replyNum: z.number(),
  bgm: z.number(),
  theme: z.number(),
  lightBright: z.number(),
  created: z.string(),
});
export type Space = z.infer<typeof SpaceSchema>;

const SpaceSearchSetSchema = z.object({
  next: z.nullable(
    z
      .string()
      .url()
      .transform((url) => new URL(url))
  ),
  results: z.array(SpaceSchema),
});

const AlarmSchema = z.object({
  fromUser: z.string(),
  user: z.string(),
  created: z.string(),
  type: z.string(),
  fromImgURL: z.string().nullable(),
  fromUserURL: z.string().nullable(),
  moveURL: z.string().nullable(),
});

export type Alarm = z.infer<typeof AlarmSchema>;

export let AlarmPageSchema = z.object({
  next: z.nullable(
    z
      .string()
      .url()
      .transform((url) => new URL(url))
  ),
  results: z.array(AlarmSchema),
});

export class APIError extends Error {
  issues: APIIssues;

  constructor(issues: APIIssues) {
    super();
    this.issues = issues;
  }
}

const API_BASE_URL = 'https://blue-lake-5691-test.fly.dev';

export async function getSpaces(
  token: Token | null,
  cursor: string | null = null
): Promise<{ spaces: Space[]; cursor: string | null }> {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let response = await fetch(API_BASE_URL + `/spaces/?cursor=${cursor ?? ''}`, {
    headers,
  });
  let json = await response.json();
  if (response.ok) {
    // throw new APIError({ code: 400,  detail: "Error", field: "Error" });
    let { next, results: spaces } = SpaceSearchSetSchema.parse(json);
    let nextCursor = next && next.searchParams.get('cursor');
    return { spaces, cursor: nextCursor };
  } else {
    let issues = APIIssuesSchema.parse(json);
    throw new APIError(issues);
  }
}

export async function getAlarm(
  token: Token,
  cursor: string | null = null
): Promise<{ alarms: Alarm[]; cursor: string | null }> {
  let response = await fetch(API_BASE_URL + `/alarms/?cursor=${cursor ?? ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  let json = await response.json();
  if (response.ok) {
    // throw new APIError({ code: 400100, detail: '', field: 'alarm' });
    let { results: alarms, next } = AlarmPageSchema.parse(json);
    let nextCursor = next && next.searchParams.get('cursor');
    return {
      alarms,
      cursor: nextCursor,
    };
  } else {
    let issues = APIIssuesSchema.parse(json);
    throw new APIError(issues);
  }
}
