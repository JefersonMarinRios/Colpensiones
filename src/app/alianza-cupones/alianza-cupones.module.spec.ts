import { AlianzaCuponesModule } from './alianza-cupones.module';

describe('AlianzaCuponesModule', () => {
  let alianzaCuponesModule: AlianzaCuponesModule;

  beforeEach(() => {
    alianzaCuponesModule = new AlianzaCuponesModule();
  });

  it('should create an instance', () => {
    expect(alianzaCuponesModule).toBeTruthy();
  });
});
