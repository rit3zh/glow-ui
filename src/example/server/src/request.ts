import * as constants from "./consts";
interface RequestOptions {
  url: string;
}

export class FetchRequest {
  private baseURL?: string;
  private headers: Record<string, string>;

  constructor(options: RequestOptions) {
    if (!options.url) throw Error("A base URL is required");
    if (typeof options.url !== "string")
      throw Error("The base URL must be a string");
    this.baseURL = options.url;
    this.headers = {};
  }
  setHeader(key: string, value: string): FetchRequest {
    this.headers[key] = value;
    return this;
  }
  async get(endpoint: string): Promise<Response> {
    const response = await fetch(this.baseURL + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response;
  }

  async post(data: any) {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    };
    const response = await fetch(this.baseURL!, options);

    if (!response.ok) {
      throw new Error(`Error posting data: ${response.statusText}`);
    }

    return await response.json();
  }
}
export default new FetchRequest({
  url: constants.BASE_URL,
});
