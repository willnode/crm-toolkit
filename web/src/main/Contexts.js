
// Dunno why redux can't be this simple.

class ContextInstance {
	states = {}
	get = (param) => (x => x && x[0])(this.states[param])
	set(param, val) {
		if (this.states[param]) {
			this.states[param][0] = val;
			this.states[param][1](val);
		}
	}
	bind(param, state) {
		this.states[param] = state;
	}
	unbind(param) {
		delete this.states[param];
	}
}

const Context = new ContextInstance();
window.Context = Context;

const TemporaryContext = {
	pushMessage: null,
	pushError: null,
	history: null,
}

export {
	Context,
	TemporaryContext,
}