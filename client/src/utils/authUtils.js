/**
 *
 * Dispatches an action to the provided dispatch function for updating the authentication state.
 * @param {Function} authDispatch - the dispatch function from the authReducer to update the state.
 * @param {string} caseToCall  - the action to dispatch.
 * @param {any} [value ] - the payload data for action (optional)
 * @returns {void}
 *
 */
export const handleDispatch = (authDispatch, caseToCall, value) => {
  authDispatch({
    type: caseToCall,
    payload: value,
  });
};
