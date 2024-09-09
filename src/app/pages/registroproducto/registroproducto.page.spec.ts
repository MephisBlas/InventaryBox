import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroproductoPage } from './registroproducto.page';

describe('RegistroproductoPage', () => {
  let component: RegistroproductoPage;
  let fixture: ComponentFixture<RegistroproductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroproductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
