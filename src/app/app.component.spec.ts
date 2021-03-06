import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

import { By } from '@angular/platform-browser';
import {
  RouterTestingModule
} from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Router},
        RouterOutlet
    ],
      declarations: [
        AppComponent
      ],
      imports: [ RouterTestingModule,
      RouterModule,
     HttpClientModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
   
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('frontend');
  });
  it('should have a router outlet',
    async(() => {
      const element = fixture.debugElement.query(By.directive(RouterOutlet));
      expect(element).not.toBeNull();
    })
  );

});
