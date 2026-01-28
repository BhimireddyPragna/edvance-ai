
import React, { useState } from 'react';
import { Unit, QuizQuestion } from '../types';

interface QuizViewProps {
  unit: Unit;
  questions: QuizQuestion[];
  onFinish: (score: number) => void;
  onCancel: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ unit, questions, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setShowExplanation(true);
  };

  if (isFinished) {
    const finalScore = selectedOption === currentQuestion.correctAnswer ? score + 1 : score;
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Unit Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">You scored {finalScore} out of {questions.length}</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => onFinish(finalScore)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Confirm Completion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mb-8 pt-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">{currentQuestion.question}</h3>

        <div className="space-y-4 mb-10">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => handleSelect(idx)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
                selectedOption === idx 
                  ? showExplanation
                    ? idx === currentQuestion.correctAnswer
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                  : showExplanation && idx === currentQuestion.correctAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-100 hover:border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-xs font-bold ${
                  selectedOption === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-semibold">{option}</span>
              </div>
              
              {showExplanation && idx === currentQuestion.correctAnswer && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="p-5 bg-slate-50 rounded-2xl mb-8 animate-in slide-in-from-top-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Explanation</p>
            <p className="text-sm text-slate-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {!showExplanation ? (
          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;
