import { defineStore } from 'pinia'
import { AlunoService } from 'src/services/alunos'

export const useAlunoStore = defineStore('aluno', {
  state: () => ({
    lista: [],
    carregando: false,
    erro: null
  }),

  getters: {
    optionsParaSelect (state) {
      return state.lista.map(a => ({
        label: a.nome,
        value: a.id
      }))
    },

    buscarPorId: (state) => (id) => {
      return state.lista.find(a => a.id === id) || null
    }
  },

  actions: {
    async carregarTodos () {
      try {
        this.carregando = true
        this.erro = null
        this.lista = await AlunoService.listar()
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao carregar alunos'
      } finally {
        this.carregando = false
      }
    },

    async criarAluno (payload) {
      try {
        this.carregando = true
        this.erro = null
        const novo = await AlunoService.criar(payload)
        this.lista.push(novo)
        return novo
      } catch (erro) {
        this.erro = erro?.message || 'Erro ao criar aluno'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async atualizarAluno (id, payload) {
      try {
        this.carregando = true
        this.erro = null
        const atualizado = await AlunoService.atualizar(id, payload)
        const idx = this.lista.findIndex(a => a.id === id)
        if (idx !== -1) this.lista[idx] = atualizado
        return atualizado
      } catch (erro) {
        this.erro = erro?.message || 'Erro ao atualizar aluno'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async removerAluno (id) {
      try {
        this.carregando = true
        this.erro = null
        await AlunoService.remover(id)
        this.lista = this.lista.filter(a => a.id !== id)
      } catch (erro) {
        this.erro = erro?.message || 'Erro ao remover aluno'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
