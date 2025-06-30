// types/serpapi.d.ts
declare module 'serpapi' {
    interface GoogleSearchParams {
      engine: string;
      q: string;
      location?: string;
      hl?: string;
      gl?: string;
      [key: string]: any;
    }
  
    class GoogleSearch {
      constructor(params: { api_key: string });
      json(params: GoogleSearchParams): Promise<any>;
    }
  
    const SerpApi: {
      GoogleSearch: typeof GoogleSearch;
    };
    export default SerpApi;
  }
  