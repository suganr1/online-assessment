import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it("logout", () => {
    component.logout();
  });

  // describe(':', () => {

  //   function setup() {
  //     const fixture = TestBed.createComponent(AppComponent);
  //     const app = fixture.debugElement.componentInstance;
  //     return { fixture, app };
  //   }

  //   it('should create the app', async(() => {
  //     const { app } = setup();
  //     expect(app).toBeTruthy();
  //   }));

  //   it('logout', async(() => {
  //     expect(setup.logout()).toBeTruthy();
  //   }));
  // });

});