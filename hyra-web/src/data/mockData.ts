import { Subject, File, Summary, Quiz, MockUser } from '@/store/useAppStore';

export const mockUsers: MockUser[] = [
  { id: 'user1', name: 'Nguyen Cong Quy', email: 'quy@student.edu', password: 'password123' },
  { id: 'user2', name: 'Student Example', email: 'student@example.edu', password: 'abc123456' },
];

export const mockSubjects: Subject[] = [
  { id: 'subj1', name: 'Mathematics', folders: ['Calculus', 'Algebra', 'Statistics'], color: '#3B82F6' },
  { id: 'subj2', name: 'Physics', folders: ['Mechanics', 'Electromagnetism', 'Thermodynamics'], color: '#10B981' },
  { id: 'subj3', name: 'Computer Science', folders: ['Data Structures', 'AI Basics', 'Algorithms'], color: '#8B5CF6' },
];

export const mockFiles: File[] = [
  { id: 'file1', name: 'Limits and Continuity.pdf', subject: 'Mathematics', folder: 'Calculus', uploadDate: '2025-01-10', size: '2.4 MB', summaryCount: 2, quizCount: 2 },
  { id: 'file2', name: 'Vector Mechanics.docx', subject: 'Physics', folder: 'Mechanics', uploadDate: '2025-01-12', size: '1.8 MB', summaryCount: 1, quizCount: 1 },
  { id: 'file3', name: 'Linear Algebra Basics.pdf', subject: 'Mathematics', folder: 'Algebra', uploadDate: '2025-01-08', size: '3.1 MB', summaryCount: 2, quizCount: 1 },
  { id: 'file4', name: 'Binary Trees.pdf', subject: 'Computer Science', folder: 'Data Structures', uploadDate: '2025-01-15', size: '1.5 MB', summaryCount: 1, quizCount: 3 },
  { id: 'file5', name: 'Maxwell Equations.pdf', subject: 'Physics', folder: 'Electromagnetism', uploadDate: '2025-01-14', size: '2.0 MB', summaryCount: 1, quizCount: 2 },
  { id: 'file6', name: 'Derivatives.pdf', subject: 'Mathematics', folder: 'Calculus', uploadDate: '2025-11-14', size: '1.9 MB', summaryCount: 1, quizCount: 0 },
  { id: 'file7', name: 'Integration Techniques.pdf', subject: 'Mathematics', folder: 'Calculus', uploadDate: '2025-11-13', size: '3.2 MB', summaryCount: 3, quizCount: 2 },
  { id: 'file8', name: 'Series and Sequences.pdf', subject: 'Mathematics', folder: 'Calculus', uploadDate: '2025-11-12', size: '2.1 MB', summaryCount: 2, quizCount: 1 },
  { id: 'file9', name: 'Multivariable Calculus.pdf', subject: 'Mathematics', folder: 'Calculus', uploadDate: '2025-11-11', size: '4.5 MB', summaryCount: 0, quizCount: 0 },
  { id: 'file10', name: 'Quantum Mechanics Intro.pdf', subject: 'Physics', folder: 'Mechanics', uploadDate: '2025-11-10', size: '3.8 MB', summaryCount: 2, quizCount: 3 },
  { id: 'file11', name: 'Neural Networks.pdf', subject: 'Computer Science', folder: 'AI Basics', uploadDate: '2025-11-09', size: '2.7 MB', summaryCount: 1, quizCount: 2 },
  { id: 'file12', name: 'Graph Algorithms.pdf', subject: 'Computer Science', folder: 'Algorithms', uploadDate: '2025-11-08', size: '2.3 MB', summaryCount: 2, quizCount: 1 },
];

export const mockSummaries: Summary[] = [
  {
    id: 'sum1',
    fileId: 'file1',
    fileName: 'Limits and Continuity.pdf',
    content: 'This document covers the fundamental concepts of limits and continuity in calculus. The epsilon-delta definition provides a rigorous foundation for understanding limits. A function f(x) is continuous at point a if the limit of f(x) as x approaches a equals f(a). Key theorems include the Intermediate Value Theorem and properties of continuous functions on closed intervals.',
    keyConcepts: ['Epsilon-Delta Definition', 'Continuity', 'Limit Laws', 'Intermediate Value Theorem', 'One-sided Limits'],
    createdAt: '2025-01-10',
    isImportant: true,
  },
  {
    id: 'sum2',
    fileId: 'file2',
    fileName: 'Vector Mechanics.docx',
    content: 'Vector mechanics introduces the study of motion using vector quantities. Displacement, velocity, and acceleration are vector quantities with both magnitude and direction. Newton\'s laws form the foundation: F = ma relates force, mass, and acceleration. The chapter covers projectile motion, circular motion, and relative velocity concepts.',
    keyConcepts: ['Vector Quantities', 'Newton\'s Laws', 'Projectile Motion', 'Circular Motion', 'Relative Velocity'],
    createdAt: '2025-01-12',
    isImportant: false,
  },
  {
    id: 'sum3',
    fileId: 'file4',
    fileName: 'Binary Trees.pdf',
    content: 'Binary trees are hierarchical data structures where each node has at most two children. Tree traversal methods include in-order, pre-order, and post-order. Binary Search Trees (BST) maintain sorted order with left children smaller and right children larger. Time complexity for search, insert, and delete operations is O(log n) for balanced trees.',
    keyConcepts: ['Tree Traversal', 'Binary Search Trees', 'Time Complexity', 'Balanced Trees', 'Node Structure'],
    createdAt: '2025-01-15',
    isImportant: true,
  },
  {
    id: 'sum4',
    fileId: 'file1',
    fileName: 'Limits and Continuity.pdf',
    content: 'Limit laws and continuity properties are essential for calculus. The sum, product, and quotient rules for limits allow us to evaluate complex limits. A function is continuous on an interval if it is continuous at every point in that interval. The composition of continuous functions is continuous.',
    keyConcepts: ['Limit Laws', 'Continuity Properties', 'Composition of Functions', 'Intervals', 'Function Evaluation'],
    createdAt: '2025-01-11',
    isImportant: false,
  },
  {
    id: 'sum5',
    fileId: 'file3',
    fileName: 'Linear Algebra Basics.pdf',
    content: 'Linear algebra focuses on vector spaces and linear transformations. Matrices represent linear transformations and systems of linear equations. Eigenvalues and eigenvectors are fundamental concepts with applications in various fields. The determinant provides important properties about square matrices.',
    keyConcepts: ['Vector Spaces', 'Linear Transformations', 'Matrices', 'Eigenvalues', 'Determinants'],
    createdAt: '2025-01-09',
    isImportant: true,
  },
  {
    id: 'sum6',
    fileId: 'file3',
    fileName: 'Linear Algebra Basics.pdf',
    content: 'Gaussian elimination is a systematic method for solving systems of linear equations. Row operations preserve the solution set while transforming the augmented matrix to row echelon form. The rank of a matrix determines the dimension of its column space and provides insights into the solution structure.',
    keyConcepts: ['Gaussian Elimination', 'Row Operations', 'Augmented Matrix', 'Rank', 'Solution Sets'],
    createdAt: '2025-01-09',
    isImportant: false,
  },
  {
    id: 'sum7',
    fileId: 'file6',
    fileName: 'Derivatives.pdf',
    content: 'The derivative measures the rate of change of a function. The definition uses limits: f\'(x) = lim(h→0) [f(x+h) - f(x)]/h. Common derivatives include power rule, product rule, quotient rule, and chain rule. Applications include optimization, related rates, and curve sketching.',
    keyConcepts: ['Rate of Change', 'Derivative Rules', 'Chain Rule', 'Optimization', 'Related Rates'],
    createdAt: '2025-11-14',
    isImportant: true,
  },
  {
    id: 'sum8',
    fileId: 'file7',
    fileName: 'Integration Techniques.pdf',
    content: 'Integration is the reverse process of differentiation. Substitution method simplifies integrals by changing variables. Integration by parts uses the product rule in reverse: ∫u dv = uv - ∫v du. Trigonometric substitution handles integrals involving radicals.',
    keyConcepts: ['Substitution', 'Integration by Parts', 'Trigonometric Substitution', 'Definite Integrals', 'Antiderivatives'],
    createdAt: '2025-11-13',
    isImportant: true,
  },
  {
    id: 'sum9',
    fileId: 'file7',
    fileName: 'Integration Techniques.pdf',
    content: 'Partial fractions decompose rational functions into simpler fractions. This technique is useful for integrating complex rational expressions. The method involves factoring the denominator and finding constants for each term.',
    keyConcepts: ['Partial Fractions', 'Rational Functions', 'Factoring', 'Decomposition', 'Integration Methods'],
    createdAt: '2025-11-13',
    isImportant: false,
  },
  {
    id: 'sum10',
    fileId: 'file7',
    fileName: 'Integration Techniques.pdf',
    content: 'Improper integrals extend integration to unbounded intervals or discontinuous functions. These integrals are evaluated using limits. Convergence tests determine whether an improper integral has a finite value.',
    keyConcepts: ['Improper Integrals', 'Unbounded Intervals', 'Convergence Tests', 'Limits', 'Infinite Values'],
    createdAt: '2025-11-13',
    isImportant: false,
  },
  {
    id: 'sum11',
    fileId: 'file8',
    fileName: 'Series and Sequences.pdf',
    content: 'A sequence is an ordered list of numbers. A series is the sum of terms in a sequence. Convergence of a series determines whether the sum approaches a finite value. Tests include ratio test, comparison test, and integral test.',
    keyConcepts: ['Sequences', 'Series Convergence', 'Ratio Test', 'Comparison Test', 'Integral Test'],
    createdAt: '2025-11-12',
    isImportant: true,
  },
  {
    id: 'sum12',
    fileId: 'file8',
    fileName: 'Series and Sequences.pdf',
    content: 'Power series represent functions as infinite polynomials. The radius of convergence determines where the series converges. Taylor and Maclaurin series approximate functions using derivatives at a point.',
    keyConcepts: ['Power Series', 'Radius of Convergence', 'Taylor Series', 'Maclaurin Series', 'Function Approximation'],
    createdAt: '2025-11-12',
    isImportant: false,
  },
  {
    id: 'sum13',
    fileId: 'file10',
    fileName: 'Quantum Mechanics Intro.pdf',
    content: 'Quantum mechanics describes the behavior of particles at atomic scales. Wave-particle duality shows that matter exhibits both wave and particle properties. The Schrödinger equation governs quantum systems and predicts probability distributions.',
    keyConcepts: ['Wave-Particle Duality', 'Schrödinger Equation', 'Quantum States', 'Probability Distributions', 'Uncertainty Principle'],
    createdAt: '2025-11-10',
    isImportant: true,
  },
  {
    id: 'sum14',
    fileId: 'file10',
    fileName: 'Quantum Mechanics Intro.pdf',
    content: 'Quantum operators represent physical observables like position, momentum, and energy. Eigenvalues correspond to possible measurement outcomes. The commutator of operators determines whether observables can be simultaneously measured precisely.',
    keyConcepts: ['Quantum Operators', 'Eigenvalues', 'Observables', 'Commutators', 'Measurement'],
    createdAt: '2025-11-10',
    isImportant: false,
  },
  {
    id: 'sum15',
    fileId: 'file11',
    fileName: 'Neural Networks.pdf',
    content: 'Neural networks are computational models inspired by biological neurons. Layers of interconnected nodes process information. Backpropagation adjusts weights to minimize error. Activation functions introduce non-linearity enabling complex pattern recognition.',
    keyConcepts: ['Neural Network Architecture', 'Backpropagation', 'Activation Functions', 'Training', 'Pattern Recognition'],
    createdAt: '2025-11-09',
    isImportant: true,
  },
  {
    id: 'sum16',
    fileId: 'file12',
    fileName: 'Graph Algorithms.pdf',
    content: 'Graph algorithms solve problems on networks of connected nodes. Breadth-first search explores nodes level by level. Depth-first search explores as far as possible along each branch. Dijkstra\'s algorithm finds shortest paths in weighted graphs.',
    keyConcepts: ['BFS', 'DFS', 'Dijkstra Algorithm', 'Shortest Paths', 'Graph Traversal'],
    createdAt: '2025-11-08',
    isImportant: true,
  },
  {
    id: 'sum17',
    fileId: 'file12',
    fileName: 'Graph Algorithms.pdf',
    content: 'Minimum spanning trees connect all vertices with minimum total edge weight. Kruskal\'s and Prim\'s algorithms find MSTs efficiently. These algorithms have applications in network design and clustering.',
    keyConcepts: ['Minimum Spanning Tree', 'Kruskal Algorithm', 'Prim Algorithm', 'Network Design', 'Graph Theory'],
    createdAt: '2025-11-08',
    isImportant: false,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    fileId: 'file1',
    fileName: 'Limits and Continuity.pdf',
    subject: 'Mathematics',
    difficulty: 'Medium',
    createdAt: '2025-01-11',
    completed: true,
    score: 85,
    questions: [
      {
        id: 'q1',
        question: 'What is the epsilon-delta definition of a limit?',
        options: [
          'For every ε > 0, there exists δ > 0 such that |f(x) - L| < ε whenever 0 < |x - a| < δ',
          'The function approaches a finite value as x increases',
          'The derivative exists at every point',
          'The function is continuous everywhere'
        ],
        correctAnswer: 0,
        userAnswer: 0,
      },
      {
        id: 'q2',
        question: 'Which condition is necessary for a function to be continuous at x = a?',
        options: [
          'The function must be differentiable at a',
          'lim(x→a) f(x) = f(a)',
          'The function must be linear',
          'The derivative must be zero'
        ],
        correctAnswer: 1,
        userAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz2',
    fileId: 'file4',
    fileName: 'Binary Trees.pdf',
    subject: 'Computer Science',
    difficulty: 'Hard',
    createdAt: '2025-01-16',
    completed: false,
    questions: [
      {
        id: 'q3',
        question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
      },
      {
        id: 'q4',
        question: 'In in-order traversal of a BST, nodes are visited in which order?',
        options: [
          'Root → Left → Right',
          'Left → Root → Right',
          'Left → Right → Root',
          'Right → Root → Left'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz3',
    fileId: 'file1',
    fileName: 'Limits and Continuity.pdf',
    subject: 'Mathematics',
    difficulty: 'Easy',
    createdAt: '2025-01-12',
    completed: false,
    questions: [
      {
        id: 'q5',
        question: 'What does it mean for a function to be continuous?',
        options: [
          'It has no breaks or jumps',
          'It is always increasing',
          'It is differentiable',
          'It has a maximum value'
        ],
        correctAnswer: 0,
      },
      {
        id: 'q6',
        question: 'What is a one-sided limit?',
        options: [
          'A limit that approaches from only the left or right',
          'A limit that equals zero',
          'A limit that does not exist',
          'A limit at infinity'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz4',
    fileId: 'file4',
    fileName: 'Binary Trees.pdf',
    subject: 'Computer Science',
    difficulty: 'Medium',
    createdAt: '2025-01-17',
    completed: true,
    score: 75,
    questions: [
      {
        id: 'q7',
        question: 'What is the maximum number of children a node can have in a binary tree?',
        options: ['0', '1', '2', 'Unlimited'],
        correctAnswer: 2,
        userAnswer: 2,
      },
      {
        id: 'q8',
        question: 'Which traversal visits nodes in sorted order for a BST?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 1,
        userAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz5',
    fileId: 'file4',
    fileName: 'Binary Trees.pdf',
    subject: 'Computer Science',
    difficulty: 'Easy',
    createdAt: '2025-01-18',
    completed: false,
    questions: [
      {
        id: 'q9',
        question: 'What is a leaf node in a binary tree?',
        options: [
          'A node with no children',
          'The root node',
          'A node with two children',
          'A node with one child'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz6',
    fileId: 'file3',
    fileName: 'Linear Algebra Basics.pdf',
    subject: 'Mathematics',
    difficulty: 'Medium',
    createdAt: '2025-01-10',
    completed: false,
    questions: [
      {
        id: 'q10',
        question: 'What is an eigenvector?',
        options: [
          'A vector that changes direction under a transformation',
          'A vector that only scales under a transformation',
          'A zero vector',
          'A unit vector'
        ],
        correctAnswer: 1,
      },
      {
        id: 'q11',
        question: 'What does the determinant of a matrix represent?',
        options: [
          'The scaling factor of the transformation',
          'The number of rows',
          'The trace of the matrix',
          'The number of eigenvalues'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz7',
    fileId: 'file2',
    fileName: 'Vector Mechanics.docx',
    subject: 'Physics',
    difficulty: 'Medium',
    createdAt: '2025-01-13',
    completed: false,
    questions: [
      {
        id: 'q12',
        question: 'What is Newton\'s Second Law?',
        options: [
          'F = ma',
          'E = mc²',
          'v = u + at',
          'KE = ½mv²'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz8',
    fileId: 'file5',
    fileName: 'Maxwell Equations.pdf',
    subject: 'Physics',
    difficulty: 'Hard',
    createdAt: '2025-01-15',
    completed: false,
    questions: [
      {
        id: 'q13',
        question: 'How many Maxwell equations are there?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
      },
      {
        id: 'q14',
        question: 'What do Maxwell\'s equations describe?',
        options: [
          'Mechanical forces',
          'Electromagnetic fields',
          'Quantum mechanics',
          'Thermodynamics'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz9',
    fileId: 'file5',
    fileName: 'Maxwell Equations.pdf',
    subject: 'Physics',
    difficulty: 'Medium',
    createdAt: '2025-01-16',
    completed: true,
    score: 90,
    questions: [
      {
        id: 'q15',
        question: 'What is the speed of light in vacuum?',
        options: [
          '3 × 10⁸ m/s',
          '3 × 10⁶ m/s',
          '3 × 10¹⁰ m/s',
          '3 × 10⁵ m/s'
        ],
        correctAnswer: 0,
        userAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz10',
    fileId: 'file7',
    fileName: 'Integration Techniques.pdf',
    subject: 'Mathematics',
    difficulty: 'Medium',
    createdAt: '2025-11-13',
    completed: false,
    questions: [
      {
        id: 'q16',
        question: 'Which method is best for integrating ∫x·eˣ dx?',
        options: [
          'Substitution',
          'Integration by parts',
          'Partial fractions',
          'Trigonometric substitution'
        ],
        correctAnswer: 1,
      },
      {
        id: 'q17',
        question: 'What is the antiderivative of 1/x?',
        options: ['x²', 'ln|x|', 'eˣ', '1/x²'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz11',
    fileId: 'file7',
    fileName: 'Integration Techniques.pdf',
    subject: 'Mathematics',
    difficulty: 'Hard',
    createdAt: '2025-11-14',
    completed: false,
    questions: [
      {
        id: 'q18',
        question: 'When using partial fractions, what must be true about the degree of the numerator?',
        options: [
          'It must be less than the degree of the denominator',
          'It must be greater than the degree of the denominator',
          'It must equal the degree of the denominator',
          'It does not matter'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz12',
    fileId: 'file8',
    fileName: 'Series and Sequences.pdf',
    subject: 'Mathematics',
    difficulty: 'Medium',
    createdAt: '2025-11-12',
    completed: false,
    questions: [
      {
        id: 'q19',
        question: 'What does it mean for a series to converge?',
        options: [
          'The sum approaches a finite value',
          'The sum approaches infinity',
          'The terms approach zero',
          'The terms increase'
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz13',
    fileId: 'file10',
    fileName: 'Quantum Mechanics Intro.pdf',
    subject: 'Physics',
    difficulty: 'Hard',
    createdAt: '2025-11-10',
    completed: false,
    questions: [
      {
        id: 'q20',
        question: 'What does the Heisenberg Uncertainty Principle state?',
        options: [
          'Position and momentum cannot both be precisely measured',
          'Energy is quantized',
          'Particles behave like waves',
          'Light has a constant speed'
        ],
        correctAnswer: 0,
      },
      {
        id: 'q21',
        question: 'What is the Schrödinger equation used for?',
        options: [
          'Calculating electromagnetic fields',
          'Describing quantum state evolution',
          'Measuring particle velocity',
          'Computing gravitational force'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz14',
    fileId: 'file10',
    fileName: 'Quantum Mechanics Intro.pdf',
    subject: 'Physics',
    difficulty: 'Medium',
    createdAt: '2025-11-11',
    completed: true,
    score: 100,
    questions: [
      {
        id: 'q22',
        question: 'What is wave-particle duality?',
        options: [
          'Matter exhibits both wave and particle properties',
          'Waves can only exist in pairs',
          'Particles cannot be waves',
          'Only light has wave properties'
        ],
        correctAnswer: 0,
        userAnswer: 0,
      },
    ],
  },
  {
    id: 'quiz15',
    fileId: 'file11',
    fileName: 'Neural Networks.pdf',
    subject: 'Computer Science',
    difficulty: 'Medium',
    createdAt: '2025-11-09',
    completed: false,
    questions: [
      {
        id: 'q23',
        question: 'What is the purpose of an activation function?',
        options: [
          'To introduce non-linearity',
          'To initialize weights',
          'To normalize inputs',
          'To calculate loss'
        ],
        correctAnswer: 0,
      },
      {
        id: 'q24',
        question: 'What is backpropagation?',
        options: [
          'A method to initialize neural networks',
          'An algorithm to adjust weights using gradients',
          'A type of activation function',
          'A data preprocessing technique'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz16',
    fileId: 'file11',
    fileName: 'Neural Networks.pdf',
    subject: 'Computer Science',
    difficulty: 'Hard',
    createdAt: '2025-11-10',
    completed: false,
    questions: [
      {
        id: 'q25',
        question: 'What problem can occur during training with very deep networks?',
        options: [
          'Overfitting only',
          'Vanishing or exploding gradients',
          'Increased accuracy',
          'Faster convergence'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'quiz17',
    fileId: 'file12',
    fileName: 'Graph Algorithms.pdf',
    subject: 'Computer Science',
    difficulty: 'Easy',
    createdAt: '2025-11-08',
    completed: false,
    questions: [
      {
        id: 'q26',
        question: 'What does BFS stand for?',
        options: [
          'Breadth-First Search',
          'Best-First Search',
          'Binary File System',
          'Balanced Forest Structure'
        ],
        correctAnswer: 0,
      },
    ],
  },
];
