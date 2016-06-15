import {ServerRequest} from 'http';

export class AugmentedRequest {
  public post: Object;
  public query: Object;
  public request: ServerRequest;

  constructor(request: ServerRequest) {
    this.request = request;
  }
}
