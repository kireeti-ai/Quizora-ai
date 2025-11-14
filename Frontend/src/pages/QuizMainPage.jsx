import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Edit3, BookOpen } from 'lucide-react';
// 1. FIX: Changed 'updateQuizId' to 'updateQuizById'
import { fetchAllQuizzes, createNewQuiz, deleteQuizById, updateQuizById } from '../services/api';

export default function QuizMainPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ title: '', category: '', numQ: 10 });
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);

    const loadQuizzes = () => {
        fetchAllQuizzes()
            .then(response => {
                const quizzesWithCount = response.data.map(q => ({
                    ...q,
                    questionsCount: q.questions ? q.questions.length : 0,
                    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }));
                setQuizzes(quizzesWithCount.sort((a, b) => b.id - a.id));
            })
            .catch(error => {
                console.error('Failed to fetch quizzes:', error);
                alert('Failed to load quizzes. Is the backend running?');
            });
    };

    const handleOpenEditModal = (quiz) => {
        setEditingQuiz(quiz);
        setShowEditModal(true);
    };

    const handleUpdateQuiz = () => {
        if (editingQuiz && editingQuiz.title) {
            updateQuizById(editingQuiz.id, editingQuiz.title) // 1. FIX: Used correct function name
                .then(() => {
                    setShowEditModal(false);
                    setEditingQuiz(null);
                    loadQuizzes();
                })
                .catch(error => {
                    console.error('Failed to update quiz:', error);
                    alert('Failed to update quiz.');
                });
        }
    }

    useEffect(() => {
        loadQuizzes();
    }, []);

    const handleCreateQuiz = () => {
        if (newQuiz.title && newQuiz.category && newQuiz.numQ > 0) {
            createNewQuiz(newQuiz.title, newQuiz.category, newQuiz.numQ)
                .then(() => {
                    setNewQuiz({ title: '', category: '', numQ: 10 });
                    setShowCreateModal(false);
                    loadQuizzes();
                })
                .catch(error => {
                    console.error('Failed to create quiz:', error);
                    alert('Failed to create quiz.');
                });
        } else {
            alert('Please fill in all fields and set questions > 0.');
        }
    };

    const handleDeleteQuiz = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            deleteQuizById(id)
                .then(() => {
                    loadQuizzes();
                })
                .catch(error => {
                    console.error('Failed to delete quiz:', error);
                    alert('Failed to delete quiz.');
                });
        }
    };

    const handleStartQuiz = (id) => {
        navigate(`/quiz/${id}`);
    };

    const totalQuestions = quizzes.reduce((sum, q) => sum + q.questionsCount, 0);
    const totalCategories = new Set(quizzes.map(q => q.category)).size;

    return (
        <div className="min-h-screen bg-amber-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header (no changes) */}
            <div className="bg-white border-b-2 border-stone-800" style={{ transform: 'rotate(-0.3deg)' }}>
                <div className="max-w-5xl mx-auto px-5 py-6" style={{ transform: 'rotate(0.3deg)' }}>
                    {/* ... (content is the same) ... */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-300 p-2 border-2 border-stone-800" style={{ transform: 'rotate(-3deg)' }}>
                                <BookOpen className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">QuizMaster</h1>
                                <p className="text-sm text-stone-600">your quizzes, your way</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 border-2 border-stone-800 font-medium hover:bg-stone-700 transition-colors"
                            style={{ transform: 'rotate(1deg)' }}
                        >
                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                            <span>New Quiz</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main (no changes) */}
            <main className="max-w-5xl mx-auto px-5 py-8">
                {/* Stats (no changes) */}
                {/* ... (content is the same) ... */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-blue-100 p-5 border-2 border-stone-800 relative" style={{ transform: 'rotate(-1deg)' }}>
                        <div className="absolute top-2 right-2 w-6 h-6 border-2 border-stone-800 bg-white" style={{ transform: 'rotate(45deg)' }}></div>
                        <p className="text-sm text-stone-600 mb-1">quizzes</p>
                        <p className="text-4xl font-bold">{quizzes.length}</p>
                    </div>

                    <div className="bg-green-100 p-5 border-2 border-stone-800" style={{ transform: 'rotate(0.5deg)' }}>
                        <p className="text-sm text-stone-600 mb-1">questions</p>
                        <p className="text-4xl font-bold">{totalQuestions}</p>
                        <div className="mt-2 flex gap-1">
                            <div className="w-8 h-1 bg-stone-800"></div>
                            <div className="w-4 h-1 bg-stone-800"></div>
                        </div>
                    </div>

                    <div className="bg-pink-100 p-5 border-2 border-stone-800 relative" style={{ transform: 'rotate(1deg)' }}>
                        <div className="absolute -top-1 -right-1 bg-yellow-300 w-8 h-8 border-2 border-stone-800 flex items-center justify-center text-xs font-bold" style={{ transform: 'rotate(-15deg)' }}>
                            ★
                        </div>
                        <p className="text-sm text-stone-600 mb-1">categories</p>
                        <p className="text-4xl font-bold">{totalCategories}</p>
                    </div>
                </div>

                {/* Section header (no changes) */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1">Your Collection</h2>
                    <div className="w-16 h-1 bg-stone-800"></div>
                </div>

                {/* Quiz cards */}
                <div className="space-y-4">
                    {quizzes.length === 0 ? (
                        // ... (empty state is the same) ...
                        <div className="bg-white p-12 border-2 border-dashed border-stone-300 text-center">
                            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500">nothing here yet...</p>
                            <p className="text-sm text-stone-400 mt-1">create your first quiz!</p>
                        </div>
                    ) : (
                        quizzes.map((quiz, index) => {
                            const rotations = ['-0.5deg', '0.3deg', '-0.3deg', '0.5deg'];
                            const colors = ['bg-purple-50', 'bg-blue-50', 'bg-green-50', 'bg-orange-50'];
                            const rotation = rotations[index % rotations.length];
                            const bgColor = colors[index % colors.length];

                            return (
                                <div
                                    key={quiz.id}
                                    className={`${bgColor} p-5 border-2 border-stone-800 hover:shadow-lg transition-shadow relative group`}
                                    style={{ transform: `rotate(${rotation})` }}
                                >
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">

                                        {/* 2. FIX: Added onClick and updated title */}
                                        <button
                                            onClick={() => handleOpenEditModal(quiz)}
                                            className="p-1.5 bg-white border-2 border-stone-800 hover:bg-yellow-200"
                                            title="Edit Title"
                                        >
                                            <Edit3 className="w-4 h-4" strokeWidth={2.5} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteQuiz(quiz.id)}
                                            className="p-1.5 bg-white border-2 border-stone-800 hover:bg-red-200"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* ... (Card content is the same) ... */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="inline-block px-2 py-0.5 bg-white border border-stone-800 text-xs font-medium mb-3">
                                                {quiz.category}
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                                            <div className="flex gap-4 text-sm text-stone-600">
                                                <span>{quiz.questionsCount} Q's</span>
                                                <span>•</span>
                                                <span>{quiz.createdAt}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartQuiz(quiz.id)}
                                            className="bg-stone-800 text-white px-4 py-2 border-2 border-stone-800 font-medium hover:bg-stone-700 flex items-center gap-2 mt-8"
                                        >
                                            <Play className="w-4 h-4" strokeWidth={2.5} fill="white" />
                                            <span>Start</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Create Modal (no changes) */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-stone-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
                    {/* ... (content is the same) ... */}
                    <div className="bg-amber-50 border-4 border-stone-800 max-w-md w-full p-6 relative" style={{ transform: 'rotate(-0.5deg)' }}>
                        <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-stone-800 px-3 py-1 font-bold" style={{ transform: 'rotate(3deg)' }}>
                            NEW!
                        </div>

                        <h2 className="text-2xl font-bold mb-1">Create Quiz</h2>
                        <div className="w-12 h-1 bg-stone-800 mb-6"></div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newQuiz.title}
                                    onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                                    className="w-full px-3 py-2 bg-white border-2 border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                    placeholder="e.g., Space Trivia"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Category</label>
                                <input
                                    type="text"
                                    value={newQuiz.category}
                                    onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
                                    className="w-full px-3 py-2 bg-white border-2 border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                    placeholder="e.g., Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Questions</label>
                                <input
                                    type="number"
                                    value={newQuiz.numQ}
                                    onChange={(e) => setNewQuiz({...newQuiz, numQ: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 bg-white border-2 border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                    placeholder="10"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 bg-white border-2 border-stone-800 font-medium hover:bg-stone-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateQuiz}
                                className="flex-1 px-4 py-2 bg-stone-800 text-white border-2 border-stone-800 font-medium hover:bg-stone-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. FIX: Added the Edit Modal JSX */}
            {showEditModal && editingQuiz && (
                <div className="fixed inset-0 bg-stone-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-amber-50 border-4 border-stone-800 max-w-md w-full p-6 relative" style={{ transform: 'rotate(0.2deg)' }}>
                        <h2 className="text-2xl font-bold mb-1">Edit Quiz Title</h2>
                        <div className="w-12 h-1 bg-stone-800 mb-6"></div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingQuiz.title}
                                    onChange={(e) => setEditingQuiz({...editingQuiz, title: e.target.value})}
                                    className="w-full px-3 py-2 bg-white border-2 border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Category</label>
                                <input
                                    type="text"
                                    value={editingQuiz.category}
                                    disabled // Can't change category
                                    className="w-full px-3 py-2 bg-stone-100 border-2 border-stone-800"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-2 bg-white border-2 border-stone-800 font-medium hover:bg-stone-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateQuiz}
                                className="flex-1 px-4 py-2 bg-stone-800 text-white border-2 border-stone-800 font-medium hover:bg-stone-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}