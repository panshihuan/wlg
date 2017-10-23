
const INPUTNUMBER_CONTANT= 'INPUTNUMBER_CONTANT';

const inputNumberReducer = (state = {}, action) => {
    switch (action.type) {
        case INPUTNUMBER_CONTANT:
            return {
                data: Object.assign({},{...state},action.data)
            }
        default:
            return state
    }
}

export default inputNumberReducer