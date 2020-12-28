const inputElement = document.querySelector('#result');
const clearBtn = document.querySelector('#clear');
const resultBtn = document.querySelector('#resultbtn');

const alt = setTimeout(() => {
	alert("If you're on a computer, you can use the keyboard.");
	clearTimeout(alt);
}, 2000);

const digits = ['0','1','2','3','4','5','6','7','8','9','.','+','-','x','*','%','÷','='];
const operations = ['+', '-', 'x', '÷', '%', '.'], sqrt = {false: '√(', true: ')'};

const maximumSize = 50;
let inputValue = '', square = false, result = false, lastChar = undefined, valueToShow;

handleHistoric();
loadConfig();

function getSavedHistoric() {
	return JSON.parse(localStorage.getItem('historic'));
}
function saveHistoric(value) {
	const savedHistoric = getSavedHistoric();
	if (!savedHistoric)
		return localStorage.setItem('historic', JSON.stringify([value]));

	savedHistoric.unshift(value);
	return localStorage.setItem('historic', JSON.stringify(savedHistoric));
}

document.querySelectorAll('.dig').forEach(el => {
	el.addEventListener('click', (evt) => {
		writeValue(evt.target)
	})
})
clearBtn.addEventListener('click', clearDigits);
resultBtn.addEventListener('click', mainCalculate);

document.addEventListener('keydown', (e)=> {
	let key = String(e.key);
	if (key === 'Backspace') return clearDigits();
	if (key === '*') key = 'x';
	if (key === '/') key = '÷';
	if (key === 'Enter') key = '=';
	
	if(digits.indexOf(key) > -1) {
		const el = document.querySelector(`button[data-value='${key}']`);
		el.click();
		el.classList.add('focus');
		const an = el.addEventListener('animationend', () => {
			el.classList.remove('focus');
			el.removeEventListener('animationend', an);
		});
	}
})

function setTheDeleteButtonTextTo(t) {
	clearBtn.innerText = t;
}

function removeChar(text, num) {
	text = text.substring(0, text.length-num);
	return text;
}

function clearDigits() {
	if (!result && inputValue !== 0) {
		if (inputValue.charAt(inputValue.length-1) === '(') {
			inputValue = removeChar(inputValue, 2);
			square = false;
			document.querySelector('button[data-value=√]').innerHTML = '√';
		}
		else {
			if (inputValue.charAt(inputValue.length-1) === ')') {
				document.querySelector('button[data-value=√]').innerHTML = ')';
				square = !square;
			}
			inputValue = removeChar(inputValue, 1);
		}
		if (inputValue.length <= 0) {

			inputValue = 0;
		}
		inputElement.value = inputValue;
		return;
	}
	result = square = false;
	setTheDeleteButtonTextTo('CE');
	document.querySelector('button[data-value=√]').innerHTML = '√';
	inputValue = '';
	inputElement.value = '0';
}

function writeValue(e) {
	let digit = e.dataset.value;
	if (inputValue.length >= maximumSize) return;
	if (result && (operations.indexOf(digit)===-1 || inputValue==='Error!'
	|| inputValue === '0' || inputValue.length >= maximumSize) && !e.t) {
		inputValue = '';
		clearDigits();
	}
	if (digit === '√' && lastChar === '√(') {
		return;
	}
	if (result && operations.indexOf(digit)>-1) {
		result = false;
		setTheDeleteButtonTextTo('CE');
	}
	
	if (operations.indexOf(digit) > -1 && digit !== '%') {
		if (digit === lastChar) return;
		else if (operations.indexOf(lastChar) > -1 && lastChar !== '%') inputValue = removeChar(inputValue, 1);
	}
	if (digit === '%' && lastChar === ')') return;
	
	if (digit === '√') {
		digit = sqrt[square];
		square = !square;
		document.querySelector('button[data-value=√]').innerHTML = square?')':'√';
	}
	if (digit !== ')') {
		const lastDigit = inputValue.length>0?inputValue.charAt(inputValue.length-1):'';
		if ((parseFloat(digit) && lastDigit === ')') || parseFloat(lastDigit) && digit==='√('
		|| lastDigit === ')' && digit==='√(') inputValue+='x';
	}
	lastChar = digit;
	if (inputValue === 0) inputValue = '';
	inputValue += digit;
	inputElement.value = inputValue.replace(/[.]/g, ',');
}

function separateNumbersAndOperations(values) {
	const separated = {numbers: '', operations: ''};
	if (operations.indexOf(values[0])>-1 && values[0]!='-') {
		values = values.substr(1, values.length-1);
	}
	inputValue = values;
	separated.numbers = values.split(/[+x÷-]/);
	separated.operations = values.split(/[^+x÷-]/);
	separated.operations = separated.operations.filter(i => i !== '');
	separated.numbers = separated.numbers.filter(i => i !== '');
	//se o primeiro digito for '-', retira o sinal das operações e coloca o sinal no primeiro número.
	if (values[0] === '-') {
		let n1 = undefined;
		separated.operations.splice(0, 1);
		separated.numbers.splice(0, 1);
		n1 = separated.numbers[0];
		separated.numbers[0] = '-'+n1;
	}

	return separated;
}

function separate(text) {
	if (operations.indexOf(lastChar)>-1 && lastChar !== '%') text = removeChar(text, 1);
	if (text.indexOf('%') > -1) {
		const forCalc = text.match(/\d{1,10}[%]/g);
		forCalc.forEach(p => {
			const number = p.replace('%', '');
			const calculate = getCalculationFunction('%');
			const percentage = 'p'+calculate(number);
			text = text.replace(p, percentage);
		});
	}
	if (text.indexOf('√') > -1) {
		const l1 = text.match(/[√][(]/g).length;
		const l2 = text.match(/[)]/g)?text.match(/[)]/g).length:0;
		if (l2 < l1) {
			inputValue = text += ')';
		}
		while (text.match(/[√]/)) {
			const inSquare = text.substring(text.indexOf('(')+1, text.indexOf(')'));
			const forRep = text.substring(text.indexOf('(')-1, text.indexOf(')')+1);
			const sepInSquare = separateNumbersAndOperations(inSquare);
			const res = basicCalculation(sepInSquare);
			const op = getCalculationFunction('√');
			let root = op(res);
			if (!root) {
				root = 'Error!'
			}
			text = text.replace(forRep, root);
		}
	}
	const error = text.match(/['E']/g);
	const separated = error?'Error!':separateNumbersAndOperations(text);
	return separated;
}

function getCalculationFunction(operation) {
	function percentage(n1, n2) {
		if (String(n2).search('p') > -1 && String(n1).search('p') <= -1) {
			n2 = String(n2).replace('p', '');
			n1 = String(n1).replace('p', '');
			n2 = parseFloat(n1) * parseFloat(n2);
		}
		n2 = String(n2).replace('p', '');
		n1 = String(n1).replace('p', '');

		return { n1, n2 };
	}
	const calculation = {
		'+': (n1, n2) => {
			const { n1:v1, n2:v2 } = percentage(n1, n2);
			return parseFloat(v1) + parseFloat(v2);
		},
		'-': (n1, n2) => {
			const { n1:v1, n2:v2 } = percentage(n1, n2);
			return parseFloat(v1) - parseFloat(v2);
		},
		'x': (n1, n2) => {
			n1 = String(n1).replace('p', '');
			n2 = String(n2).replace('p', '');
			return parseFloat(n1) * parseFloat(n2);
		},
		'÷': (n1, n2) => {
			n1 = String(n1).replace('p', '');
			n2 = String(n2).replace('p', '');
			return parseFloat(n1) / parseFloat(n2);
		},
		'%': (n1) => { return (parseFloat(n1) / 100)},
		'√': (n1) => { return Math.sqrt(n1)},
	}

	return calculation[operation];
}

function basicCalculation(n) {
	let total = 0, firstC = false, final = false;
	if (n.operations.length <= 0)  {
		return n.numbers[0];
	}
	//--> cálculo na ordem correta
	function getOperationPositions(op) {
		const newArray = n.operations.map((value, index) => {
			if (value === op) {
				return index;
			}
		});
		return newArray.filter(v => v);
	}

	function operationsPriorities(array) {
		if (array.length <= 0 && final) {
			return;
		}
		if (array.length <= 0 && !final) {
			final = true;
			array = getOperationPositions('x');
		}
		array.map((position, index) => {
			const n1 = n.numbers[position];
			const n2 = n.numbers[position+1];
			const op = n.operations[position];
			const fct = getCalculationFunction(op);
			const result = fct(n1, n2);
			if (result) {
				n.numbers[position] = String(result);
				n.numbers.splice(position+1, 1);
				n.operations.splice(position, 1);
			}
			array.splice(index, 1);
			if (!array) {
				array = getOperationPositions('x');
				final = true;
				return operationsPriorities(getOperationPositions('x'));
			}
		});
	}
	const positions = getOperationPositions('÷');
	operationsPriorities(positions);

	for (let i = 0;i < n.operations.length;i++) {
		const fct = getCalculationFunction(n.operations[i]), n2 = n.numbers[i+1];
		if (n2) {
			total = fct(firstC?total:n.numbers[i], n2);
		}
		firstC = true;
	}
	return total;
}

function mainCalculate() {
	let verify = inputValue.match(/\d*[+x%÷-]+\d/g);
	if (!verify) {
		verify = inputValue.match(/[(](-|)+\d/g);
	}
	if (!verify) {
		verify = inputValue.match(/\d[%]/g);
	}
	if (!verify)
	return;
	valueToShow = inputValue;
	if (inputValue.match(/[(]/g) && inputValue.search(/[)]/g) <= -1) {
		valueToShow+=')';
	}
	let res, total = 0;

	res = separate(inputValue);

	if (res === 'Error!') {
		total = res;
	}
	else if (res.operations.length <= 0) {
		total = res.numbers[0];
	}
	else {
		total = basicCalculation(res);
	}
	if (!total && total !== 0) return

	result = true;
	if (String(total).search(/[.]/)>-1) { //número decimal muito longo
		if (String(total).length > 20) {
			total = String(total).substring(0, 16);
		}
	}

	total = {
		dataset: {
			value: String(total),
		},
		t: true,
	};
	setTheDeleteButtonTextTo('AC');
	const newHistoric = `${valueToShow.replace(/[.]/g, ',')}=${total.dataset.value}`;
	saveHistoric(newHistoric);
	handleHistoric(newHistoric);
	inputValue = '';
	writeValue(total);
}