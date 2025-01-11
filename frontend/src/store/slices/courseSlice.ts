import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface CourseState {
  courses: [];
  courseId: string;
  courseName: string;
  s3url: string;
  json: string;
}

const initialState: CourseState = {
  courses: [],
  courseId: "",
  courseName: "",
  s3url: "",
  json: "",
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseData: (state, action: PayloadAction<CourseState>) => {
      return { ...state, ...action.payload };
    },
    clearCourseData: () => initialState,
  },
});

const persistConfig = {
  key: "course",
  storage,
};

export const { setCourseData, clearCourseData } = courseSlice.actions;
export default persistReducer(persistConfig, courseSlice.reducer);
