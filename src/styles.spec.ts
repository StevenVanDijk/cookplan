import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

describe('Angular Material theme (US-012)', () => {
  const stylesPath = resolve(__dirname, 'styles.scss');
  const content = readFileSync(stylesPath, 'utf-8');

  it('imports @angular/material as mat', () => {
    expect(content).toMatch(/@use ['"]@angular\/material['"] as mat/);
  });

  it('calls mat.theme() to apply the Material Design theme', () => {
    expect(content).toContain('@include mat.theme(');
  });

  it('specifies a primary palette colour', () => {
    expect(content).toMatch(/primary:\s*mat\.\$/);
  });
});
