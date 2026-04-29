describe('Build smoke test', () => {
  it('imports app entry point without errors', async () => {
    const mod = await import('./app');
    expect(mod.App).toBeDefined();
  });
});
