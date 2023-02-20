import { MensajeModule } from './mensaje-indisponibilidad.module';

describe('MensajeModule', () => {
  let mensajeModule: MensajeModule;

  beforeEach(() => {
    mensajeModule = new MensajeModule();
  });

  it('should create an instance', () => {
    expect(mensajeModule).toBeTruthy();
  });
});
