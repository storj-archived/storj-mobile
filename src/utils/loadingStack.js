export default class LoadingStack {
    constructor(array) {
        this.loadingStack = array.slice();
    }

    setLoading(value) {
        this.loadingStack.push(value);
        return this.loadingStack;
    }

    unsetLoading(value) {
        let index = this.loadingStack.indexOf(value);

        if(index === -1) {
            return this.loadingStack;
        }

        this.loadingStack.splice(index, 1);
        return this.loadingStack;
    }
}