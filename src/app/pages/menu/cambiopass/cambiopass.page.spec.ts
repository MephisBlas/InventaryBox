import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiopassPage } from './cambiopass.page';

describe('CambiopassPage', () => {
  let component: CambiopassPage;
  let fixture: ComponentFixture<CambiopassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiopassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
