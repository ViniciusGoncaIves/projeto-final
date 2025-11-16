// src/stores/professor-store.js
import { defineStore } from 'pinia'
import { ProfessorService } from 'src/services/professores'

export const useProfessorStore = defineStore('professor', {
  state: () => ({
    lista: [],
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarTodos () {
      try {
        this.carregando = true
        this.erro = null
        this.lista = await ProfessorService.listar()
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao carregar professores'
      } finally {
        this.carregando = false
      }
    },

    async criarProfessor (payload) {
      try {
        this.carregando = true
        this.erro = null
        const novoProfessor = await ProfessorService.criar(payload)
        this.lista.push(novoProfessor)
        return novoProfessor
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao criar professor'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async atualizarProfessor (id, payload) {
      try {
        this.carregando = true
        this.erro = null
        const professorAtualizado = await ProfessorService.atualizar(id, payload)
        const indice = this.lista.findIndex(p => p.id === id)
        if (indice !== -1) {
          this.lista[indice] = professorAtualizado
        }
        return professorAtualizado
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao atualizar professor'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async removerProfessor (id) {
      try {
        this.carregando = true
        this.erro = null
        await ProfessorService.remover(id)
        this.lista = this.lista.filter(p => p.id !== id)
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao remover professor'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
