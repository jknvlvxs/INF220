import { Hotels } from 'src/models/hotels';
import api from './api';

export const findAll = async () => {
  const response = await api.get('/hotel');
  console.log(response.data.hotels);
  return response.data.hotels as Hotels[];
};

export const findOne = async (id) => {
  const response = await api.get(`/hotel/${id}`);
  return response.data as Hotels;
};

export const create = async (data) => {
  const response = await api.post('/hotel', data);
  return response.data as Hotels;
};

export const update = async (id, data) => {
  try {
    const response = await api.patch(`/hotel/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const remove = async (id) => {
  const response = await api.delete(`/hotel/${id}`);
  return response.data.hotel[0] as Hotels;
};