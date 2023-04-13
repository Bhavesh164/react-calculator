import { useReducer } from 'react'
import './styles.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
    ADD_DIGIT:'add-digit',
    CHOOSE_OPERATION:'choose-operation',
    CLEAR:'clear',
    DELETE_DIGIT:'delete-digit',
    EVALUATE:'evaluate',
}

function reducer(state,{ type, payload}) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if((state.previousOperand!=null) && (state.operation==null) && (state.currentOperand==undefined)){
                return {
                    ...state,
                    previousOperand: null,
                    currentOperand: `${state.currentOperand || ''}${payload.digit}`,
                }
            }
            if(state.overwrite){
                return {
                    ...state,
                    currentOperand: `${state.currentOperand || ''}${payload.digit}`,
                    overwrite:false
                }
            }
            if(state.currentOperand === "0" && payload.digit === "0") return state;
            if((state.currentOperand!=undefined) && (payload.digit === "." && state.currentOperand.includes("."))) {
                return state;
            }
            if((state.operation!=null)) {
                return {
                    ...state,
                    currentOperand: `${state.currentOperand || ''}${payload.digit}`,
                    previousOperand: state.previousOperand,
                }
            }
            if((state.operation==null) && (state.previousOperand!=null)) {
                return {
                    ...state,
                    currentOperand: `${state.currentOperand || ''}${payload.digit}`,
                    previousOperand: null
                }
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`,
            }
        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand == null && state.previousOperand == null) return state
            if(state.previousOperand == null){
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            if(state.currentOperand == null){
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            return {
                ...state,
                operation: payload.operation,
                previousOperand: evaluate(state),
                currentOperand: null
            }
        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite){
                return {
                    ...state,
                    overwrite:false,
                    currentOperand:null,
                    previousOperand:null
                }
            }
            if(state.currentOperand==null) return state;
            if(state.currentOperand.length=='1') {
                return {
                    ...state,
                    currentOperand:null
                }
            }
            return {
                ...state,
                currentOperand:state.currentOperand.slice(0,-1)
            }
        case ACTIONS.EVALUATE:
            if(state.currentOperand==null) return state;
            return {
                ...state,
                operation: payload.operation,
                previousOperand: evaluate(state),
                currentOperand: null,
                overwrite: true
            }
    }
}
const INTEGER_FORMATTER=new Intl.NumberFormat("en-us",{
    maximumFractionDigits:0,
})

function formatOperand(operand) {
    if (operand==null) {
        return
    }
    const [integer,decimal]=operand.split(".")
    if(decimal==null){
        return INTEGER_FORMATTER.format(integer)
    }
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function evaluate({currentOperand, previousOperand, operation},digit='') {
    let prev = parseFloat(previousOperand);
    let current;
    if(digit!='') {
        current=parseFloat(digit);
    } else {
        current = parseFloat(currentOperand);
    }
    if(isNaN(prev) || isNaN(current)) return ""
    let computation=""
    switch (operation) {
        case "+":
            computation=prev+current;
            break;
        case "-":
            computation=prev-current;
            break;
        case "*":
            computation=prev*current;
            break;
        case "/":
            computation=prev/current;
            break;
    }
    return computation.toString();
}

function App() {
    const [{currentOperand, previousOperand, operation},dispatch]=useReducer(reducer,{})
    return(
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand">{formatOperand(previousOperand)}{operation}</div>
                <div className="current-operand">{formatOperand(currentOperand)}</div>
            </div>
            <button className="span-two" onClick={()=>{dispatch({type:ACTIONS.CLEAR})}}>AC</button>
            <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>Del</button>
            <OperationButton operation="/" dispatch={dispatch}>/</OperationButton>
            <DigitButton digit="1" dispatch={dispatch}>1</DigitButton>
            <DigitButton digit="2" dispatch={dispatch}>2</DigitButton>
            <DigitButton digit="3" dispatch={dispatch}>3</DigitButton>
            <OperationButton operation="*" dispatch={dispatch}>*</OperationButton>
            <DigitButton digit="4" dispatch={dispatch}>4</DigitButton>
            <DigitButton digit="5" dispatch={dispatch}>5</DigitButton>
            <DigitButton digit="6" dispatch={dispatch}>6</DigitButton>
            <OperationButton operation="+" dispatch={dispatch}>+</OperationButton>
            <DigitButton digit="7" dispatch={dispatch}>7</DigitButton>
            <DigitButton digit="8" dispatch={dispatch}>8</DigitButton>
            <DigitButton digit="9" dispatch={dispatch}>9</DigitButton>
            <OperationButton operation="-" dispatch={dispatch}>-</OperationButton>
            <DigitButton digit="." dispatch={dispatch}>.</DigitButton>
            <DigitButton digit="0" dispatch={dispatch}>0</DigitButton>
            <button className="span-two" onClick={()=>dispatch({type: ACTIONS.EVALUATE,payload:operation})}>=</button>
        </div>
    )
}

export default App
