import { ContactanosModule } from './contactanos.module';

describe('MensajeModule', () => {
  let contactanosModule: ContactanosModule;

  beforeEach(() => {
    contactanosModule = new ContactanosModule();
  });

  it('should create an instance', () => {
    expect(contactanosModule).toBeTruthy();
  });
});
