import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopService from '../../services/shop';

const initialState = {
  loading: false,
  shops: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchShops = createAsyncThunk('shop/fetchShops', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await shopService.getAll({ ...initialState.params, ...params });
    console.log('fetchShops API response:', res.data);
    return res;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShopPosStatus: (state, action) => {
      const { uuid, pos_access } = action.payload;
      state.shops = state.shops.map(shop =>
        shop.uuid === uuid ? { ...shop, pos_access } : shop
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.shops = payload.data.map((item) => ({
          created_at: item.created_at,
          active: item.show_type,
          tax: item.tax,
          open: item.open,
          name: item.translation !== null ? item.translation.title : 'no name',
          seller: item.seller
            ? `${item.seller.firstname} ${item.seller.lastname}`
            : '',
          uuid: item.uuid,
          logo_img: item.logo_img,
          back: item.background_img,
          id: item.id,
          locales: item.locales,
          status: item.status,
          deleted_at: item.deleted_at,
          verify: item.verify,
          pos_access: item.pos_access, 
        }));
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Failed to fetch shops';
      });
  },
});

export default shopSlice.reducer;
export const { updateShopPosStatus } = shopSlice.actions;