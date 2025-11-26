import { create } from "zustand";
import {
  mockUsers,
  mockSubjects,
  mockFiles,
  mockSummaries,
  mockQuizzes,
} from "@/data/mockData";

export interface Subject {
  id: string;
  name: string;
  folders: string[];
  color: string;
}

export interface File {
  id: string;
  name: string;
  subject: string;
  uploadDate: string;
  size: string;
  summaryCount: number;
  quizCount: number;
}

export interface Summary {
  id: string;
  fileId: string;
  fileName: string;
  content: string;
  keyConcepts: string[];
  createdAt: string;
  isImportant: boolean;
}

export interface Quiz {
  id: string;
  fileId: string;
  fileName: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: QuizQuestion[];
  createdAt: string;
  score?: number;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  theme: "light" | "dark";
  notifications: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mockUsers: MockUser[];
  subjects: Subject[];
  files: File[];
  summaries: Summary[];
  quizzes: Quiz[];
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addFile: (file: File) => void;
  deleteFile: (id: string) => void;
  addSummary: (summary: Summary) => void;
  toggleImportant: (id: string) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuizScore: (id: string, score: number) => void;
  updateUser: (data: Partial<User>) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  mockUsers: mockUsers,
  subjects: mockSubjects,
  files: mockFiles,
  summaries: mockSummaries,
  quizzes: mockQuizzes,

  addSubject: (subject) =>
    set((state) => ({ subjects: [...state.subjects, subject] })),

  updateSubject: (id, data) =>
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),

  deleteSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
      files: state.files.filter(
        (f) => f.subject !== state.subjects.find((s) => s.id === id)?.name
      ),
    })),

  addFile: (file) => set((state) => ({ files: [...state.files, file] })),

  deleteFile: (id) =>
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      return {
        files: state.files.filter((f) => f.id !== id),
        summaries: state.summaries.filter((s) => s.fileId !== id),
        quizzes: state.quizzes.filter((q) => q.fileId !== id),
      };
    }),

  addSummary: (summary) =>
    set((state) => {
      const file = state.files.find((f) => f.id === summary.fileId);
      return {
        summaries: [...state.summaries, summary],
        files: file
          ? state.files.map((f) =>
              f.id === summary.fileId
                ? { ...f, summaryCount: f.summaryCount + 1 }
                : f
            )
          : state.files,
      };
    }),

  toggleImportant: (id) =>
    set((state) => ({
      summaries: state.summaries.map((s) =>
        s.id === id ? { ...s, isImportant: !s.isImportant } : s
      ),
    })),

  addQuiz: (quiz) =>
    set((state) => {
      const file = state.files.find((f) => f.id === quiz.fileId);
      return {
        quizzes: [...state.quizzes, quiz],
        files: file
          ? state.files.map((f) =>
              f.id === quiz.fileId ? { ...f, quizCount: f.quizCount + 1 } : f
            )
          : state.files,
      };
    }),

  updateQuizScore: (id, score) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) =>
        q.id === id ? { ...q, score, completed: true } : q
      ),
    })),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  login: async (email, password) => {
    // Simulate API call with axios placeholder
    // await axios.post('/api/login', { email, password });

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers = get().mockUsers;
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const user: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            theme: "light",
            notifications: true,
          };

          set({
            user,
            token: `mock-token-${foundUser.id}`,
            isAuthenticated: true,
          });

          resolve({ success: true, message: "Login successful!" });
        } else {
          resolve({ success: false, message: "Invalid email or password" });
        }
      }, 800);
    });
  },

  register: async (name, email, password) => {
    // Simulate API call with axios placeholder
    // await axios.post('/api/register', { name, email, password });

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers = get().mockUsers;
        const existingUser = mockUsers.find((u) => u.email === email);

        if (existingUser) {
          resolve({ success: false, message: "Email already registered" });
          return;
        }

        const newMockUser: MockUser = {
          id: `user${Date.now()}`,
          name,
          email,
          password,
        };

        const newUser: User = {
          id: newMockUser.id,
          name: newMockUser.name,
          email: newMockUser.email,
          theme: "light",
          notifications: true,
        };

        set((state) => ({
          mockUsers: [...state.mockUsers, newMockUser],
          user: newUser,
          token: `mock-token-${newMockUser.id}`,
          isAuthenticated: true,
        }));

        resolve({ success: true, message: "Registration successful!" });
      }, 800);
    });
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
