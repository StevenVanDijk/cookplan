import { TestBed } from '@angular/core/testing';
import { MealsComponent } from './meals.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('MealsComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MealsComponent],
      providers: [provideAnimations()],
    }).compileComponents();
  });

  // US-007: Add a meal idea
  it('adds a meal when the add button is clicked', () => {
    const fixture = TestBed.createComponent(MealsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.newName.set('Stir Fry');
    component.newTagsRaw.set('asian, quick');
    component.add();
    fixture.detectChanges();

    expect(component.meals().length).toBe(1);
    expect(component.meals()[0].name).toBe('Stir Fry');
    expect(component.meals()[0].tags).toContain('asian');
  });

  // US-008: Remove a meal idea
  it('removes a meal by id', () => {
    const fixture = TestBed.createComponent(MealsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.newName.set('Soup');
    component.add();
    const id = component.meals()[0].id;
    component.remove(id);
    fixture.detectChanges();

    expect(component.meals().length).toBe(0);
  });

  it('shows empty hint when no meals exist', () => {
    const fixture = TestBed.createComponent(MealsComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('No meal ideas yet');
  });
});
