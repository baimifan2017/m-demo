import { rounding } from '../utils';

describe('utils tests', () => {
  it('should Be null', () => {
    expect(rounding()).toEqual();
  });

  it('should be equal toString', () => {
    const value = 1;
    expect(rounding(value)).not.toEqual(value);
    expect(rounding(value)).toEqual(`${value}.00`);
  });
});
