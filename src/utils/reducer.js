export const initialState = {
   mainUser:null
  };
  
  export const actionTypes = {
    SET_MAIN_USER: "SET_MAIN_USER",
    REMOVE_MAIN_USER:"REMOVE_MAIN_USER"
  };
  
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.SET_MAIN_USER:
        return {
          ...state,
          mainUser:action.payload
        };
      case actionTypes.REMOVE_MAIN_USER: return {
        mainUser:null,
        contacts:[]
      }
      default:
        return state;
    }
  };
  
  export default reducer;
  