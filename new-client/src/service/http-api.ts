type ApiEndpoint = string;
type ApiParameters = { [key: string]: any };
type HttpMethod = (url: string, parameters: ApiParameters) => Promise<Response>;

export interface Api {
  apiGet<ResponseT>(endpoint: ApiEndpoint, parameters: ApiParameters): Promise<ResponseT>;

  apiPost<ResponseT>(endpoint: ApiEndpoint, parameters: ApiParameters): Promise<ResponseT>;
}

export class HttpApi implements Api {
  private readonly credentials: RequestCredentials = 'include';

  constructor(private serverUrl: string) {
  }

  public apiGet<ResponseT>(endpoint: ApiEndpoint, parameters: ApiParameters): Promise<ResponseT> {
    return this.httpApiCall(endpoint, parameters, (url, parameters) => this.httpGet(url, parameters));
  }

  public apiPost<ResponseT>(endpoint: ApiEndpoint, parameters: ApiParameters): Promise<ResponseT> {
    return this.httpApiCall(endpoint, parameters, (url, parameters) => this.httpPost(url, parameters));
  }

  httpApiCall<ResponseT>(endpoint: ApiEndpoint, parameters: ApiParameters, method: HttpMethod): Promise<ResponseT> {
    const url = this.serverUrl + endpoint;
    return method(url, parameters).then(response => {
      if (response.status === 401) {
        window.location.reload();
      }
      return response.json();
    }).catch(error => {
      this.onError(error, url);
      throw error;
    });
  }

  httpGet(url: string, parameters: ApiParameters): Promise<Response> {
    const paramString = new URLSearchParams(parameters).toString();
    const finalUrl = url + (paramString ? ('?' + paramString) : '');
    return fetch(finalUrl, {
      method: 'GET',
      credentials: this.credentials,
      headers: {},
    });
  }

  httpPost(url: string, parameters: ApiParameters): Promise<Response> {
    let params = new FormData();
    for (let key in parameters) {
      params.append(key, parameters[key]);
    }
    return fetch(url, {
      method: 'POST',
      credentials: this.credentials,
      headers: {},
      body: params,
    });
  }

  onError(error: { message: string }, url: string) {
    console.error('Error: ', url, 'returned', error.message);
  }
}
