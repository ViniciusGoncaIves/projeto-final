import { api } from 'src/boot/axios'

export const ProfessorService = {
  async listar () {
    const { data } = await api.get('/professores')
    return data
  },

  async buscarPorId (id) {
    const { data } = await api.get(`/professores/${id}`)
    return data
  },

  async criar (payload) {
    const { data } = await api.post('/professores', payload)
    return data
  },

  async atualizar (id, payload) {
    const { data } = await api.put(`/professores/${id}`, payload)
    return data
  },

  async remover (id) {
    await api.delete(`/professores/${id}`)
  }
}
