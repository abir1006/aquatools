const init = {};

const vaccineModelScreenReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_VACCINE_NAMES': {
            return {
                ...state,
                vaccineNames: action.payload
            }
        }

        case 'ADD_VACCINE_NAMES': {
            const engAlpha = ['A', 'A', 'A', 'B', 'C', 'D', 'F'];
            const nextVaccine = 2 + state.vaccineNames.length;
            state.vaccineNames.push({name: engAlpha[nextVaccine]});
            return {
                ...state,
                vaccineNames: [...state.vaccineNames]
            }
        }

        case 'REMOVE_VACCINE_NAMES': {
            state.vaccineNames.pop();
            return {
                ...state,
                vaccineNames: [...state.vaccineNames]
            }
        }

        case 'SET_VACCINE_CASE_NAMES': {
            return {
                ...state,
                vaccineCaseLabels: action.payload
            }
        }

        default:
            return state;

    }
};

export default vaccineModelScreenReducer;


