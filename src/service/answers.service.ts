import { api } from "@/http/api";
import { Answers } from "@/models/answers";

export type ItemAccuracy = {
  correct: number;
  wrong: number;
  accuracy: number;
  item: string; 
}

interface ItemsAccuracy {
  status: number;
  data: ItemAccuracy[];
  message: string; 
}

export const answersService = {
  async getItemsAccuracy(): Promise<ItemsAccuracy> {
    const resp = await api.get("/answers/items-accuracy");
    console.log(resp);
    return resp;
  },

  async createAnswer(data: Answers): Promise<any> {
    const resp = await api.post("/answers", data);
    return resp;
  },
};
