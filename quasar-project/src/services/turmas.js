import { api } from 'src/boot/axios'

export const TurmaService = {
  async listar () {
    const { data } = await api.get('/turmas')
    return data
  },

  async buscarPorId (id) {
    const { data } = await api.get(`/turmas/${id}`)
    return data
  },

  async criar (payload) {
    const { data } = await api.post('/turmas', payload)
    return data
  },

  async atualizar (id, payload) {
    const { data } = await api.put(`/turmas/${id}`, payload)
    return data
  },

  async remover (id) {
    await api.delete(`/turmas/${id}`)
  }
}
