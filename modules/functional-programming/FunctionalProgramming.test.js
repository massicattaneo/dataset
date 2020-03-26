import { FunctionalProgramming } from './FunctionalProgramming';

FunctionalProgramming(Function);
const fp = FunctionalProgramming();

describe('FUNCTIONAL PROGRAMMING', () => {

    describe('when using the extended Function prototype', () => {

        it('should partial functions', () => {
            const fn = e => e + 1;
            const partial = fn.partial(1);
            expect(partial).toBeInstanceOf(Function);
            expect(partial()).toEqual(2);
        });

    });

    describe('when creating a standalone object', () => {

        it('should partial functions', () => {
            const fn = e => e + 1;
            const partial = fp.partial(fn, 1);
            expect(partial).toBeInstanceOf(Function);
            expect(partial()).toEqual(2);
        });

    });

});
