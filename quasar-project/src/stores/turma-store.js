// src/stores/turma-store.js
import { defineStore } from 'pinia'
import { TurmaService } from 'src/services/turmas'

export const useTurmaStore = defineStore('turma', {
  state: () => ({
    lista: [],        // [{ id, nome, alunos_ids: number[] }]
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarTodas () {
      try {
        this.carregando = true
        this.erro = null
        this.lista = await TurmaService.listar()
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao carregar turmas'
      } finally {
        this.carregando = false
      }
    },

    async criarTurma (payload) {
      try {
        this.carregando = true
        this.erro = null

        // payload esperado:
        // { nome: string, alunos_ids: number[] }
        const novaTurma = await TurmaService.criar(payload)
        this.lista.push(novaTurma)
        return novaTurma
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao criar turma'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async atualizarTurma (id, payload) {
      try {
        this.carregando = true
        this.erro = null

        // payload esperado:
        // { nome: string, alunos_ids: number[] }
        const turmaAtualizada = await TurmaService.atualizar(id, payload)
        const indice = this.lista.findIndex(t => t.id === id)
        if (indice !== -1) {
          this.lista[indice] = turmaAtualizada
        }
        return turmaAtualizada
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao atualizar turma'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async removerTurma (id) {
      try {
        this.carregando = true
        this.erro = null

        await TurmaService.remover(id)
        this.lista = this.lista.filter(t => t.id !== id)
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao remover turma'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
