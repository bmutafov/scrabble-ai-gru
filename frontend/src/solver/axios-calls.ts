import axios from "axios";

const BASE_URL = "http://localhost:5100";

export class AxiosCalls {
  static async startsWith(word: string, depth?: number): Promise<string[]> {
    const response = await axios.get<string[]>(
      encodeURI(BASE_URL + "/startsWith?prefix=" + word + (depth ? "&depth=" + depth : ""))
    );
    const { data } = response;
    return data;
  }

  static async endsWith(word: string, depth?: number): Promise<string[]> {
    const response = await axios.get<string[]>(
      encodeURI(BASE_URL + "/endsWith?suffix=" + word + (depth ? "&depth=" + depth : ""))
    );
    const { data } = response;
    return data;
  }

  static async between(prefix: string, suffix: string): Promise<string[]> {
    const response = await axios.get<string[]>(encodeURI(BASE_URL + "/between?prefix=" + prefix + "&suffix=" + suffix));
    const { data } = response;
    return data;
  }

  static async byPattern(word: string, b: string[], a: string[], h: string[]): Promise<string[]> {
    try {
      const response = await axios.post<string[]>(encodeURI(BASE_URL + "/pattern"), {
        s: word,
        b,
        a,
        h,
      });
      const { data } = response;
      return data;
    } catch (e) {
      console.error("ERROR: with patthern " + word);
      throw new Error();
    }
  }

  static async solve(row: string[], hand: string[]): Promise<{ word: string; index: number }[]> {
    try {
      const response = await axios.post<{ word: string; index: number }[]>(encodeURI(BASE_URL + "/solve"), {
        row,
        hand,
      });
      const { data } = response;
      return data;
    } catch (e) {
      console.error("ERROR: with patthern ", row, hand);
      throw new Error();
    }
  }
}
