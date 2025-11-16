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
    // JSON Server gera id se você não mandar; no seu caso você pode mandar string também
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
