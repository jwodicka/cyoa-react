// Copied from https://github.com/relayjs/relay-examples/blob/master/issue-tracker/src/JSResource.js
// Definitely subject to change, this is experimental!
/**
 * A generic resource: given some method to asynchronously load a value - the loader()
 * argument - it allows accessing the state of the resource.
 */
class Resource {
  constructor(loader) {
    this._error = null;
    this._loader = loader;
    this._promise = null;
    this._result = null;
  }

  /**
   * Loads the resource if necessary.
   */
  load() {
    let promise = this._promise;
    if (promise == null) {
      promise = this._loader()
        .then(result => {
          this._result = result;
          return result;
        })
        .catch(error => {
          this._error = error;
          throw error;
        });
      this._promise = promise;
    }
    return promise;
  }

  /**
   * Returns the result, if available. This can be useful to check if the value
   * is resolved yet.
   */
  get() {
    if (this._result != null) {
      return this._result;
    }
  }

  /**
   * This is the key method for integrating with React Suspense. Read will:
   * - "Suspend" if the resource is still pending (currently implemented as
   *   throwing a Promise, though this is subject to change in future
   *   versions of React)
   * - Throw an error if the resource failed to load.
   * - Return the data of the resource if available.
   */
  read() {
    if (this._result != null) {
      return this._result;
    } else if (this._error != null) {
      throw this._error;
    } else {
      if (this._promise == null) {
        // Just in case this invokes before load has been called.
        this.load();
      }
      throw this._promise;
    }
  }
}

export default Resource;