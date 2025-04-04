import React, { useState, useEffect, useCallback } from 'react'; 
import Button from './Button';
import Display from './Display';
import { evaluate } from 'mathjs';

const Calculator: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    const calculate = (expression: string): string => {
        try {
            // Проверяем на деление на ноль
            if (expression.includes('/0')) {
                return "Ошибка: Деление на ноль";
            }

            const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, '');
            if (!sanitizedExpression) return "Ошибка: некорректное выражение";

            const evalResult = evaluate(sanitizedExpression);
            return evalResult.toString();
        } catch (error) {
            return "Ошибка: некорректное выражение";
        }
    };

    const handleButtonClick = useCallback((value: string) => {
        // Преобразуем ввод в строку для валидации
        const lastChar = input.charAt(input.length - 1);

        // Прокачиваем логику, чтобы не вводить два нуля подряд
        if (value === '0' && lastChar === '0') {
            return;  // Не разрешаем вводить два нуля подряд
        }

        // Проверка на ввод двух одинаковых операторов подряд
        if (["+", "-", "*", "/"].includes(value) && ["+", "-", "*", "/"].includes(lastChar)) {
            return;  // Не разрешаем вводить два оператора подряд
        }

        // Проверка на ввод после точки (два знака после десятичной точки)
        if (value === '.' && lastChar === '.') {
            return;  // Не разрешаем вводить несколько точек подряд
        }

        // Добавляем символ в строку
        if (value === '=') {
            const evalResult = calculate(input);
            setResult(evalResult);
            setHistory([...history, `${input} = ${evalResult}`]);
            setInput('');
        } else if (value === 'C') {
            setInput('');
            setResult('');
        } else if (value === '⌫') {
            setInput(input.slice(0, -1));
        } else if (value === '+/-') {
            const lastNumber = input.match(/[-]?\d*\.?\d+/);
            if (lastNumber) {
                const number = lastNumber[0];
                const newNumber = number.startsWith('-') ? number.slice(1) : `-${number}`;
                setInput(input.replace(/[-]?\d*\.?\d+$/, newNumber));
            }
        } else {
            setInput(input + value);
        }
    }, [input, history]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const { key } = event;
            if (/[0-9+\-*/.=]/.test(key)) {
                handleButtonClick(key);
            } else if (key === 'Enter') {
                handleButtonClick('=');
            } else if (key === 'Backspace') {
                handleButtonClick('⌫');
            } else if (key === 'Escape') {
                handleButtonClick('C');
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleButtonClick]);

    return (
        <div className={`calculator ${darkMode ? 'dark' : ''}`}>
            <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "Light" : "Dark "}
            </button>
            <Display value={input || result} />
            <div className="buttons">
                {["789/", "456*", "123-", ".0+", "=C⌫"].map(row => 
                    row.split('').map((label: string) => (
                        <Button key={label} label={label} onClick={() => handleButtonClick(label)} />
                    ))
                )}
                <Button label="+/-" onClick={() => handleButtonClick('+/-')} />
            </div>
            <div className="history">
                <h3>История:</h3>
                <ul>
                    {history.map((entry, index) => <li key={index}>{entry}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default Calculator;