import axios from "axios";

const getBaseUrl = () => {
  return "https://scrabble-ai-gru.herokuapp.com";
};

export class AxiosCalls {
  static async startsWith(word: string, depth?: number): Promise<string[]> {
    const response = await axios.get<string[]>(
      encodeURI(getBaseUrl() + "/startsWith?prefix=" + word + (depth ? "&depth=" + depth : ""))
    );
    const { data } = response;
    return data;
  }

  static async endsWith(word: string, depth?: number): Promise<string[]> {
    const response = await axios.get<string[]>(
      encodeURI(getBaseUrl() + "/endsWith?suffix=" + word + (depth ? "&depth=" + depth : ""))
    );
    const { data } = response;
    return data;
  }

  static async between(prefix: string, suffix: string): Promise<string[]> {
    const response = await axios.get<string[]>(
      encodeURI(getBaseUrl() + "/between?prefix=" + prefix + "&suffix=" + suffix)
    );
    const { data } = response;
    return data;
  }

  static async byPattern(word: string, b: string[], a: string[], h: string[]): Promise<string[]> {
    try {
      const response = await axios.post<string[]>(encodeURI(getBaseUrl() + "/pattern"), {
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
      const response = await axios.post<{ word: string; index: number }[]>(encodeURI(getBaseUrl() + "/solve"), {
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
