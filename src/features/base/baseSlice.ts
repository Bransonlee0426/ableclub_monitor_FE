import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBaseDataList, BaseItem } from '../../api/base';

export interface BaseState {
  data: BaseItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BaseState = {
  data: [],
  status: 'idle',
  error: null,
};

export const getBaseData = createAsyncThunk(
  'base/fetchData',
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const response = await fetchBaseDataList(params);
      return response.items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch data');
    }
  }
);

export const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBaseData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBaseData.fulfilled, (state, action: PayloadAction<BaseItem[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getBaseData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearData } = baseSlice.actions;
export default baseSlice.reducer;
