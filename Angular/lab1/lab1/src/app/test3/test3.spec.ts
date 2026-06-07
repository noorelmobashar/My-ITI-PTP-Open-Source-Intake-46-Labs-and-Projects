import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Test3 } from './test3';

describe('Test3', () => {
  let component: Test3;
  let fixture: ComponentFixture<Test3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test3],
    }).compileComponents();

    fixture = TestBed.createComponent(Test3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
