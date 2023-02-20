import { SeccionBienestarModule } from './seccion-bienestar.module';

describe('SeccionBienestarModule', () => {
  let seccionBienestarModule: SeccionBienestarModule;

  beforeEach(() => {
    seccionBienestarModule = new SeccionBienestarModule();
  });

  it('should create an instance', () => {
    expect(seccionBienestarModule).toBeTruthy();
  });
});
