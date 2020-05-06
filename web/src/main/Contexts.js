
// There are many heated discussions, which state managers
// you should choose. The most reasonable answer is that,
// you don't need them. MobX or Redux or whatever. I don't
// implement any custom binding to third parties so you won't
// get locked in. Any way this custom written state manager
// handles nearly all use case of your small app states.
// Just make sure that there's no mounted component holding 2
// or more state with same name at a time. Enjoy.

class ContextInstance {
  // Inner variable
  constructor() {
    this.states = {}
  }
  // Get current state
  get(param) {
    return (x => x && x[0])(this.states[param])
  }
  // Set value of state. Source hook will be triggered.
  set(param, val) {
    if (this.states[param]) {
      this.states[param][0] = val;
      this.states[param][1](val);
    }
  }
  // Send useState() values here every render call
  bind(param, state) {
    this.states[param] = state;
    return state;
  }
  // Prevent state leaks by calling this before unmount.
  unbind(param) {
    delete this.states[param];
  }
}

// Singleton.
const Context = new ContextInstance();

// For debugging.
window.Context = Context;

// Temporary holding vars. Either it is read only or always be deferred.
const TemporaryContext = {
  history: null,
  roles: null,
}

export {
  Context,
  TemporaryContext,
}