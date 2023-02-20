import { CalificacionContenidoModule } from './calificacion-contenido.module'

describe('CalificacionContenidoModule', () => {
  let calificacionContenidoModule: CalificacionContenidoModule;

  beforeEach(() => {
    calificacionContenidoModule = new CalificacionContenidoModule();
  });

  it('should create an instance', () => {
    expect(calificacionContenidoModule).toBeTruthy();
  });
});
