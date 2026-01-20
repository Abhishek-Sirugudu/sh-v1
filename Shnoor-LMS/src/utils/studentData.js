const MOCK_DATA_KEY = 'shnoor_student_data';

export const DEFAULT_DATA = {
    currentUser: {
        uid: 'student_001',
        name: 'Demo Student',
        email: 'student@shnoor.com',
        xp: 350,
        streak: 3
    },
    practiceChallenges: [
        { 
            id: 'c1', 
            title: 'Two Sum', 
            difficulty: 'Easy', 
            status: 'Solved', 
            points: 10, 
            tags: ['Arrays', 'Hash Map'],
            text: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
            testCases: [
                { input: '[2,7,11,15], 9', output: '[0,1]', isPublic: true },
                { input: '[3,2,4], 6', output: '[1,2]', isPublic: true }
            ]
        },
        { 
            id: 'c2', 
            title: 'Reverse String', 
            difficulty: 'Easy', 
            status: 'Unsolved', 
            points: 10, 
            tags: ['String'],
            text: 'Write a function that reverses a string.',
            starterCode: 'function reverseString(s) {\n  return s.split("").reverse().join("");\n}',
            testCases: [{ input: '"hello"', output: '"olleh"', isPublic: true }]
        },
        { 
            id: 'c3', 
            title: 'LRU Cache', 
            difficulty: 'Hard', 
            status: 'Locked', 
            points: 50, 
            tags: ['Design', 'Linked List'],
            text: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
            starterCode: 'class LRUCache {\n  constructor(capacity) {\n    \n  }\n}',
            testCases: []
        }
    ],
    exams: [
        { 
            id: 'exam_001', 
            title: 'React.js Professional Certification', 
            duration: 60, 
            status: 'available', 
            passScore: 70,
            questions: [
                { id: 1, type: 'mcq', text: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax', 'JSON X'], correctAnswer: 'JavaScript XML', marks: 5 }
            ]
        },
        { 
            id: 'exam_002', 
            title: 'Advanced Backend Architecture', 
            duration: 90, 
            status: 'locked', 
            prerequisite: 'Node.js Fundamentals',
            questions: []
        }
    ],
    certificates: [
        { 
            id: 'cert_web_01', 
            courseName: 'Web Development Bootcamp', 
            issueDate: 'Dec 15, 2025', 
            score: 95, 
            instructor: 'Prof. Smith' 
        }
    ]
};

export const getStudentData = () => {
    const stored = localStorage.getItem(MOCK_DATA_KEY);
    if (stored) return JSON.parse(stored);
    
    // Initialize if empty
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
};

export const saveStudentData = (data) => {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
};