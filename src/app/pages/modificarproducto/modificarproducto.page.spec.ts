import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarproductoPage } from './modificarproducto.page';

describe('ModificarproductoPage', () => {
  let component: ModificarproductoPage;
  let fixture: ComponentFixture<ModificarproductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarproductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
