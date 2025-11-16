import { api } from 'src/boot/axios'

export const NotaService = {
  async listar () {
    const { data } = await api.get('/notas')
    return data
  },

  async buscarPorId (id) {
    const { data } = await api.get(`/notas/${id}`)
    return data
  },

  async criar (payload) {
    const { data } = await api.post('/notas', payload)
    return data
  },

  async atualizar (id, payload) {
    const { data } = await api.put(`/notas/${id}`, payload)
    return data
  },

  async remover (id) {
    await api.delete(`/notas/${id}`)
  }
}
