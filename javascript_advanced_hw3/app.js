window.onload = function () {

    const DOMstructure = (function () {

        const displayInput = document.querySelector('.container__input--form');
        const backspace = document.querySelector('.container__input--previous');
        const buttonsArray = document.getElementsByClassName('container__dights--dight');
        const controlsArray = document.getElementsByClassName('container__controlPanel--action');

        function dightsPanelListeners() {
            for (let i = 0; i < buttonsArray.length; i++) {
                buttonsArray[i].addEventListener('click', () => {
                    if (i <= 8) {
                        currentDisplay(i + 1);
                    };
                    switch (i) {
                        case 9:
                            currentDisplay('.');
                            break;
                        case 10:
                            currentDisplay(0);
                            break;
                        case 11:
                            currentDisplay('00');
                            break;
                        case 12:
                            currentDisplay('cos');
                            break;
                        case 13:
                            currentDisplay('sin');
                            break;
                        case 14:
                            displayInput.value = '';
                            break;
                    };
                });
            };
        };

        function controlPanelListeners() {
            for (let i = 0; i < controlsArray.length; i++) {
                controlsArray[i].addEventListener('click', () => {
                    switch (i) {
                        case 0:
                            currentDisplay('+');
                            break;
                        case 1:
                            currentDisplay('-');
                            break;
                        case 2:
                            currentDisplay('*');
                            break;
                        case 3:
                            currentDisplay('/');
                            break;
                        case 4:
                            currentDisplay('(');
                            break;
                        case 5:
                            currentDisplay(')');
                            break;
                        case 6:
                            currentDisplay('^');
                            break;
                        case 7:
                            currentDisplay('sqrt');
                            break;
                        case 8:
                            let display = StringUnparser.parse(displayInput.value);
                            Calculation.pCalc(display);
                            Calculation.priorities(display);
                            let result = Result.calc(display);
                            displayInput.value = Result.equality(result);
                            break;
                    };
                });
            };
        };

        function currentDisplay(data) {
            let temp = []
            let tempStr = ''
            if (displayInput.value) {
                temp = Parser.separateDights(displayInput.value);
                temp.push(data);
                tempStr = temp.join('');
                displayInput.value = tempStr;
                temp = [];
                tempStr = '';
            } else {
                if (data === '.') {
                    displayInput.value = '0.';
                } else {
                    displayInput.value = data;
                };
            };
        };

        backspace.onclick = () => {
            let temp = [];
            let tempStr = ''
            if (displayInput.value) {
                temp = Parser.separateDights(displayInput.value);
                temp.splice(temp.length - 1, 1);
                tempStr = temp.join('');
                displayInput.value = tempStr;
                temp = [];
                tempStr = ''
            };
        };

        return {
            displayValue: displayInput,
            backspace: backspace,
            dightsPanel: dightsPanelListeners,
            controlPanel: controlPanelListeners,
            display: currentDisplay
        };
    })();

    const Parser = (function () {

        function toNum(str) {
            const parsedArr = str.split('').map(elem => {
                for (let i = 0; i < 10; i++) {
                    if (elem == i) {
                        return i;
                    } else if (isNaN(elem)) {
                        return elem;
                    };
                };
            });
            return parsedArr;
        };

        function tokenParser(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (!isNaN(arr[i]) && (!isNaN(arr[i + 1]) && typeof (arr[i + 1]) !== 'string')) {
                    arr[i + 1] += arr[i] * 10;
                    arr.splice(i, 1);
                    i = 0;
                } else if ((arr[i] === '.') && !isNaN(arr[i + 1])) {
                    let temp = [];
                    temp.push(arr[i]);
                    for (let n = (i + 1); !isNaN(arr[n]); n++) {
                        temp.push(String(arr[n]));
                        arr.splice(n, 1);
                        n--;
                    };
                    arr[i] = temp.join('');
                    temp = [];
                };
            };
            return arr;
        };

        function finalDightParser(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (!isNaN(arr[i]) && ((arr[i + 1]) ? arr[i + 1].startsWith('.') : false)) {
                    const token = Number(String(arr[i]) + arr[i + 1]);
                    arr[i] = token;
                    arr.splice(i + 1, 1)
                }
            };
            return arr;
        };

        function operationParser(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === 's' && arr[i + 1] === 'i') {
                    arr.splice(i + 1, 2);
                } else if (arr[i] === 'c' && arr[i + 1] === 'o') {
                    arr.splice(i + 1, 2);
                } else if (arr[i] === 's' && arr[i + 1] === 'q') {
                    arr[i] = String(arr[i] + arr[i + 1]);
                    arr.splice(i + 1, 3);
                };
            };
            return arr;
        };

        return {
            separateDights: toNum,
            tokenization: tokenParser,
            parser: finalDightParser,
            preparator: operationParser,
        };

    })();

    const StringUnparser = (function () {

        function parseFromString(string) {
            const arr = Parser.separateDights(string);
            Parser.tokenization(arr);
            Parser.parser(arr);
            Parser.preparator(arr);
            return arr;
        };
        return {
            parse: parseFromString,
        };
    })();

    const Calculation = (function () {

        const commandPriority = [
            { command: '+', priority: 1, },
            { command: '-', priority: 1, },
            { command: '*', priority: 2, },
            { command: '/', priority: 2, },
            { command: '^', priority: 3, },
            { command: 'sq', priority: 1, },
            { command: 's', priority: 1, },
            { command: 'c', priority: 1, },
        ];

        function preCalculate(arr) {
            for (let i = 0; i < arr.length; i++) {
                if ((arr[i] === 'c' || 's' || 'sq' || '^') && !isNaN(arr[i + 1]) && (arr[i + 2] !== '(')) {
                    switch (arr[i]) {
                        case 'c':
                            arr[i + 1] = Math.cos(arr[i + 1]);
                            arr.splice(i, 1);
                            break;
                        case 's':
                            arr[i + 1] = Math.sin(arr[i + 1]);
                            arr.splice(i, 1);
                            break;
                        case 'sq':
                            arr[i + 1] = Math.sqrt(arr[i + 1]);
                            arr.splice(i, 1);
                            break;
                        case '^':
                            if (arr[i - 1] === ')') {
                                break;
                            }
                            arr[i - 1] = Math.pow(arr[i - 1], arr[i + 1]);
                            arr.splice(i, 2);
                            break;
                    };
                };
            };
            return arr
        };

        function commandPriorities(arr) {
            for (let i = 0; i < arr.length; i++) {
                switch (arr[i]) {
                    case '+':
                        arr[i] = commandPriority[0]
                        break;
                    case '-':
                        arr[i] = commandPriority[1]
                        break;
                    case '*':
                        arr[i] = commandPriority[2]
                        break;
                    case '/':
                        arr[i] = commandPriority[3]
                        break;
                    case '^':
                        arr[i] = commandPriority[4]
                        break;
                    case 'sq':
                        arr[i] = commandPriority[5]
                        break;
                    case 's':
                        arr[i] = commandPriority[6]
                        break;
                    case 'c':
                        arr[i] = commandPriority[7]
                        break;
                    default:
                        arr[i] = arr[i]
                        break;
                };
            };
            return arr
        };

        return {
            pCalc: preCalculate,
            priorities: commandPriorities
        };

    })();

    const Result = (function () {

        function calculate(arr) {

            const pushOutArr = [];
            const commands = [];
            let temp;

            const mixinType = function () {
                temp = commands.pop();
                pushOutArr.push(temp);
                temp = undefined;
            };

            for (let i = 0; i < arr.length; i++) {
                            
                if (!isNaN(arr[i])) {
                    pushOutArr.push(arr[i]);
                } else if ((commands.length === 0) || (arr[i] === '(') || (commands[commands.length - 1] === '(')) {
                    commands.push(arr[i])
                } else if ((arr[i].priority === commands[commands.length - 1].priority)) {
                    mixinType();
                    commands.push(arr[i]);
                } else if (arr[i] === ')') {
                    for (let i = commands.length; commands[i - 1] !== '('; i--) {
                        mixinType();
                    }
                    commands.splice(commands.length - 1, 1)
                } else if ((arr[i].priority > commands[commands.length - 1].priority)) {
                    commands.push(arr[i]);
                } else if ((arr[i].priority < commands[commands.length - 1].priority)) {
                    mixinType();
                    commands.push(arr[i]);
                }
            }
            for (let i = commands.length; i > 0; i--) {
                mixinType();
            }
            return pushOutArr;
        };

        function equality(arr) {

            const dightsStack = [];
            let temp;
            let dight1;
            let dight2;

            const mixinTypeEq = function (command) {
                dight2 = dightsStack.pop();
                switch (command.command) {
                    case '+':
                        dight1 = dightsStack.pop();
                        temp = dight1 + dight2;
                        break;
                    case '-':
                        dight1 = dightsStack.pop();
                        temp = dight1 - dight2;
                        break;
                    case '*':
                        dight1 = dightsStack.pop();
                        temp = dight1 * dight2;
                        break;
                    case '/':
                        dight1 = dightsStack.pop();
                        temp = dight1 / dight2;
                        break;
                    case '^':
                        dight1 = dightsStack.pop();
                        temp = Math.pow(dight1, dight2);
                        break;
                    case 'sq':
                        temp = Math.sqrt(dight2)
                        break;
                    case 's':
                        temp = Math.sin(dight2)
                        break;
                    case 'c':
                        temp = Math.cos(dight2)
                        break;
                };
                dightsStack.push(temp);
                temp = undefined;
            }

            for (let i = 0; i < arr.length; i++) {
                if (!isNaN(arr[i])) {
                    dightsStack.push(arr[i]);
                } else if (arr[i].command) {
                    mixinTypeEq(arr[i]);
                }
            }
            return dightsStack;
        }

        return {
            calc: calculate,
            equality: equality
        }

    })();

    DOMstructure.dightsPanel();
    DOMstructure.controlPanel();
}(); //app end