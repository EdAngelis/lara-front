import { api } from "@/http/api";
import { Answers } from "@/models/answers";

export const answersService = {
  async getAnswers(): Promise<any[]> {
    const resp = await api.get("/answers");
    return resp;
  },

  async createAnswer(data: Answers): Promise<any> {
    const resp = await api.post("/answers", data);
    return resp;
  },
};
