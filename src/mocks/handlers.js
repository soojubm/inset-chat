import { http, HttpResponse, delay } from "msw";

const rooms = [
  { id: "general", title: "기본" },
  { id: "dev", title: "실험" },
  { id: "ai", title: "AI" },
  { id: "bonono", title: "ㅇㅇㅇㅇ" },
];

// 에러 데모용: 20% 확률로 실패
const maybeFail = () => Math.random() < 0.2;

export const handlers = [
  http.get("/api/rooms", async () => {
    await delay(1200);

    return HttpResponse.json({ rooms });
  }),

  http.get("/api/general", async () => {
    await delay(2000);

    if (maybeFail()) {
      return HttpResponse.json(
        { message: "Failed to load rooms (mock error)" },
        { status: 500 },
      );
    }

    return HttpResponse.json({});
  }),
];
