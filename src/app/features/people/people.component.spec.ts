import { TestBed } from '@angular/core/testing';
import { PeopleComponent } from './people.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('PeopleComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PeopleComponent],
      providers: [provideAnimations()],
    }).compileComponents();
  });

  // US-002: Add a person to the roster
  it('adds a person when the add button is clicked', () => {
    const fixture = TestBed.createComponent(PeopleComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.newName.set('Alice');
    component.add();
    fixture.detectChanges();

    expect(component.persons().length).toBe(1);
    expect(component.persons()[0].name).toBe('Alice');
  });

  // US-003: Remove a person from the roster
  it('removes a person by id', () => {
    const fixture = TestBed.createComponent(PeopleComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.newName.set('Bob');
    component.add();
    const id = component.persons()[0].id;
    component.remove(id);
    fixture.detectChanges();

    expect(component.persons().length).toBe(0);
  });

  it('shows empty hint when no people exist', () => {
    const fixture = TestBed.createComponent(PeopleComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('No people yet');
  });
});
