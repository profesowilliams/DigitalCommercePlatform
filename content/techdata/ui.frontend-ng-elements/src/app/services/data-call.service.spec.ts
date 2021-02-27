import { TestBed } from '@angular/core/testing';

import { DataCallService } from './data-call.service';

describe('DataCallService', () => {
  let service: DataCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
