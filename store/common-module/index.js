
const reducerWheight = (accumulator, currentValue) =>
    accumulator + currentValue.weight;

const reducerMomentum = (accumulator, currentValue) =>
    Math.round(accumulator) +
    (currentValue.weight * currentValue.distance) / 100;




const state = () => ({
    availableShapes: ["triangle", "circle", "rectangle"],
    userShapes: [],
    computerShapes: [],
});

const mutations = {
    addNewShape(state, [shapesArrayName, shapeObj]) {
        state[shapesArrayName] = [
            ...state[shapesArrayName],
            shapeObj
        ];
    },
    removeAllShapes(state) {
        state.userShapes = [];
        state.computerShapes = [];
    },
    removeLastShape(state, shapesArrayName) {
        state[shapesArrayName] = state[shapesArrayName].slice(0, -1);
    },
};

const getters = {
    shapesWeight: (state) => (shapesArrayName) => state[shapesArrayName].reduce(reducerWheight, 0),
    shapesMomentum: (state) => (shapesArrayName) => state[shapesArrayName].reduce(reducerMomentum, 0),
};


export default {
    namespaced: true,
    state,
    mutations,
    getters
}
