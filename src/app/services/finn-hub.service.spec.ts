import { TestBed } from '@angular/core/testing';

import { FinnHubService } from './finn-hub.service';

describe('FinnHubService', () => {
  let service: FinnHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinnHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
