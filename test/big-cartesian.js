(() => {

    function* bigCartesian(
        iterables) {
        if (!Array.isArray(iterables)) {
            return throwValidation();
        }

        if (iterables.length === 0) {
            return;
        }

        const iteratorFuncs = iterables.map(getIteratorFuncs);

        yield* getResults(iteratorFuncs);
    }


    const getIteratorFuncs = (input) => {
        const iterator = input[
            Symbol.iterator];


        if (typeof iterator === "function") {
            return iterator.bind(input);
        }

        if (typeof input !== "function") {
            return throwValidation();
        }

        return input;
    };


    const getResults = function* (
        iteratorFuncs) {
        const iterators = iteratorFuncs.map(getIterator);
        const results = iterators.map(getInitialValue);

        if (hasEmptyIterators(results)) {
            return;
        }

        const result = results.map(getValue);


        do {
            yield[...result];
        } while (!getResult(iteratorFuncs, iterators, result));
    };

    const getIterator = (iteratorFunc) => {
        const iterator = iteratorFunc();

        if (!isIterator(iterator)) {
            return throwValidation();
        }

        return iterator;
    };

    const throwValidation = () => {
        throw new TypeError("Argument must be an array of arrays or generators");
    };

    const isIterator = (value) =>
        typeof value === "object" &&

        value !== null &&
        typeof value.next === "function";

    const getInitialValue = (iterator) => iterator.next();

    const hasEmptyIterators = (results) =>
        results.some(isEmptyIterator);

    const isEmptyIterator = ({done}) => done;

    const getValue = ({value}) => value;


    const getResult = (
        iteratorFuncs,
        iterators,
        result) => {
        let reset = false;
        let index = iterators.length - 1;

        do {
            const iterator = iterators[index];

            const {done, value} = iterator.next();

            result[index] = value;

            if (reset) {
                reset = false;
                index--;

                if (index === -1) {
                    return true;
                }
            } else if (done === true) {
                reset = true;
                iterators[index] = iteratorFuncs[index]();
            } else {
                break;
            }
        } while (true);

        return false;
    };

    module.exports = bigCartesian;

})()