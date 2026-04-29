import { TestBed } from '@angular/core/testing';
import { ScheduleComponent } from './schedule.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ScheduleComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ScheduleComponent],
      providers: [provideAnimations()],
    }).compileComponents();
  });

  // US-001: View this week's cooking schedule
  it('renders seven days for the current week', () => {
    const fixture = TestBed.createComponent(ScheduleComponent);
    fixture.detectChanges();
    const days = fixture.nativeElement.querySelectorAll('.day-card');
    expect(days.length).toBe(7);
  });

  it('shows empty-state message when no people are added', () => {
    const fixture = TestBed.createComponent(ScheduleComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('People');
  });
});
