import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { approveLand, rejectLand, getAllLandsWithOwners } from "../api/LandApi";

// Fetch all lands with owner details
export const fetchAllLands = createAsyncThunk(
  "land/fetchAllLands",
  async () => {
    const res = await getAllLandsWithOwners();
    return res; 
  }
);

// Approve land thunk
export const approveLandById = createAsyncThunk(
  "land/approveLand",
  async ({ landId, requestId }: { landId: string; requestId: string }) => {
    const res = await approveLand(landId, requestId);
    return res;
  }
);



// Reject land thunk
export const rejectLandById = createAsyncThunk(
  "land/reject",
  async (landId: string) => {
    const res = await rejectLand(landId);
    return { landId, ...res };
  }
);

interface LandState {
  lands: any[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: LandState = {
  lands: [],
  loading: false,
  success: false,
  error: null,
};

const landSlice = createSlice({
  name: "land",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Fetch all lands with owner
    builder
      .addCase(fetchAllLands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLands.fulfilled, (state, action) => {
        state.loading = false;
        state.lands = action.payload;
      })
      .addCase(fetchAllLands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch lands";
      });

    // ✅ Approve land
    builder
      .addCase(approveLandById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(approveLandById.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(approveLandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Approval failed";
      });

    // ✅ Reject land
    builder
      .addCase(rejectLandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLandById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lands = state.lands.map((land) =>
          land._id === action.payload.landId
            ? { ...land, status: "rejected" }
            : land
        );
      })
      .addCase(rejectLandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Rejection failed";
      });
  },
});

export default landSlice.reducer;
