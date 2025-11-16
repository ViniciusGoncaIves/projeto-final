import { api } from 'src/boot/axios'

export const AlunoService = {
  async listar () {
    const { data } = await api.get('/alunos')
    return data
  },

  async buscarPorId (id) {
    const { data } = await api.get(`/alunos/${id}`)
    return data
  },

  async criar (payload) {
    const { data } = await api.post('/alunos', payload)
    return data
  },

  async atualizar (id, payload) {
    const { data } = await api.put(`/alunos/${id}`, payload)
    return data
  },

  async remover (id) {
    await api.delete(`/alunos/${id}`)
  }
}
