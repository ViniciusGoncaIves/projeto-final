import { api } from 'src/boot/axios'

export const DisciplinaService = {
  async listar () {
    const { data } = await api.get('/disciplinas')
    return data
  },

  async buscarPorId (id) {
    const { data } = await api.get(`/disciplinas/${id}`)
    return data
  },

  async criar (payload) {
    const { data } = await api.post('/disciplinas', payload)
    return data
  },

  async atualizar (id, payload) {
    const { data } = await api.put(`/disciplinas/${id}`, payload)
    return data
  },

  async remover (id) {
    await api.delete(`/disciplinas/${id}`)
  }
}
