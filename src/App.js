import { useEffect, useState, useRef } from 'react';
import Typewriter from "typewriter-effect";
import './App.css';
import './components/Snowflake.css';
import FrequentWords from './Assets/FrequentWords.js'
import Snowflakes from './components/Snowflakes';
import Dropdown from './components/Dropdown';
import ThemeList from './components/ThemesList';

function App() {
  const [wordBatch, setWordBatch] = useState([]);
  const [userInput] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [dataIndex, setDataIndex] = useState(0);
  const [correctHit, setCorrectHit] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(ThemeList[0]);
  const [snowing, setSnowing] = useState(false);
  const inputRef = useRef()

   /////////////// WORD LIST SETTING UP ///////////////////////
  const wordDataset = FrequentWords.split('\n');
  const wordBatchLength = 22;
  
  const createWordList = (dataset) => {
    let randomList = []
    for (var i = 0; randomList.length < wordBatchLength; i++) {
      let word = dataset[Math.floor(Math.random() * dataset.length)];
      if (word === word.toLowerCase() && word.length < 10) {
        randomList.push(word);
      }
    }
    setWordBatch(randomList);
    setActiveLetter(randomList[0][0]);
  }
  useEffect(() => { createWordList(wordDataset) }, []) // eslint-disable-line react-hooks/exhaustive-deps


   /////////////// INPUT PROCESSING ///////////////////////
  const focus = () => {
    inputRef.current.focus()
  }

  const getNextLetter = (wordArray, index) => {
    setActiveLetter((wordArray.join(' '))[index]);
  }
  const getNextWord = (currentWordindex) => {
    if (activeLetter === ' ') {
      setActiveWordIndex(currentWordindex + 1);
      setActiveLetterIndex(0);
    }
  }
  const getNextList = (wordIndex, letterindex, list) => {
    if (wordIndex === wordBatchLength - 1 && letterindex + 1 === list[wordIndex].length) {
      createWordList(wordDataset);
      setActiveWordIndex(0);
      setActiveLetterIndex(0);
      setDataIndex(0);
    }
  }

  useEffect(() => { getNextLetter(wordBatch, dataIndex) });

  function handleUserInput(typedLetter) {
    if (typedLetter === activeLetter) {
      setActiveLetterIndex(prevIndex => prevIndex + 1);
      setDataIndex(prevIndex => prevIndex + 1);
      setCorrectCount(prevCount => prevCount + 1);
      getNextWord(activeWordIndex);
      setCorrectHit(true);
      getNextList(activeWordIndex, activeLetterIndex, wordBatch);
    }
    else {
      setActiveLetterIndex(activeLetterIndex);
      setIncorrectCount(prevCount => prevCount + 1);
      setCorrectHit(false);
    }
  }

  const resetAll = () => {
    setWordBatch([]);
    createWordList(wordDataset);
    setActiveWordIndex(0);
    setActiveLetterIndex(0);
    setDataIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

   /////////////// PRECISION CALCULATION ///////////////////////
  const successRate = () => {
    if ((correctCount + incorrectCount) > 0) {
      return Math.floor((correctCount / (correctCount + incorrectCount)) * 100);
    }
  }

  /////////////// THEMES & STYLING ///////////////////////
  let letterClassName = 'active-letter';
  let textWrapperClass = 'text-wrapper';
  if (!correctHit) {
    letterClassName = 'incorrect-hit';
    textWrapperClass = 'text-wrapper-incorrect';
  }

  function handleThemeSelect(item) {
    setSelectedTheme(item);
  }

  const isItSnowing = () => {
    if (selectedTheme.value === 'xmas') {
      setSnowing(true);
    }
    else setSnowing(false);
  }
  useEffect(() => { isItSnowing() });

  /////////////// APP ///////////////////////
  return (
    <div className="area" data-theme={selectedTheme.value}>
      <div className="container">
        <div className='upper-container'>
          <div className='titles-wrapper'>
            <h1>Hyper Typer</h1>
            <h4><Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("Feel the hype for the type(ing)...")
                  .pauseFor(3000)
                  .deleteAll()
                  .typeString("Sharpen your typing skills here")
                  .start()
              }}
            /></h4>
          </div>
          <div className='side-panel'>
            <h4>Theme</h4>
            <Dropdown title={selectedTheme.value}
              items={ThemeList}
              selectionHandle={handleThemeSelect}
            />
            <button className='reset-btn' onClick={resetAll}>Reset Typer</button>
          </div>
        </div>
        
        <div className='stats'>
          <div className='rate-board'>
            <div className='rate-count'>
              <div className='rate-text'>precision rate: </div>
              <div className='rate-number'
                style={{ color: (correctCount / (correctCount + incorrectCount)) >= 0.5 ? 'green' : 'red' }}
              >{successRate()}</div>
              <div className='rate-text'>%</div>
            </div>
            <div className='hit-count'>
              <div>correct hits: {correctCount}</div>
              <div>incorrect hits:{incorrectCount} </div>
            </div>
          </div>
        </div>

        <div className='input-wrapper'>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            placeholder='CLICK TO TYPE'
            autoFocus
            onChange={(e) => handleUserInput(e.target.value)}
          />
        </div>

        <div className={textWrapperClass}
          onClick={focus}>
          <div>{wordBatch.map((word, wordIndex) => {
            if (wordIndex === activeWordIndex) {
              return (
                <span key={wordIndex}>
                  {word.split('').map((letter, letterIndex) => {
                    if (letterIndex === activeLetterIndex) {
                      return <span className={letterClassName}
                        key={letterIndex}>
                        {letter}
                      </span>
                    }
                    return <span className='nonactive-letters'
                        key={letterIndex}>
                        {letter}
                      </span>
                  })}
                </span>
              )
            }
            return <span key={wordIndex}> {word} </span>
          }
          )}
          </div>
        </div>

        <Snowflakes totalSnowflakes={snowing ? 16 : 0} />
      </div>

    </div>
  );
}

export default App;


