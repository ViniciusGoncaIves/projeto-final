import { defineStore } from 'pinia'
import { DisciplinaService } from 'src/services/disciplinas'

export const useDisciplinaStore = defineStore('disciplina', {
  state: () => ({
    lista: [],
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarTodas () {
      try {
        this.carregando = true
        this.erro = null
        this.lista = await DisciplinaService.listar()
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao carregar disciplinas'
      } finally {
        this.carregando = false
      }
    },

    async criarDisciplina (payload) {
      try {
        this.carregando = true
        this.erro = null
        const novaDisciplina = await DisciplinaService.criar(payload)
        this.lista.push(novaDisciplina)
        return novaDisciplina
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao criar disciplina'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async atualizarDisciplina (id, payload) {
      try {
        this.carregando = true
        this.erro = null
        const disciplinaAtualizada = await DisciplinaService.atualizar(id, payload)
        const indice = this.lista.findIndex(d => d.id === id)
        if (indice !== -1) {
          this.lista[indice] = disciplinaAtualizada
        }
        return disciplinaAtualizada
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao atualizar disciplina'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async removerDisciplina (id) {
      try {
        this.carregando = true
        this.erro = null
        await DisciplinaService.remover(id)
        this.lista = this.lista.filter(d => d.id !== id)
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao remover disciplina'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
