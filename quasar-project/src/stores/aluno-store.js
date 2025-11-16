// src/stores/aluno-store.js
import { defineStore } from 'pinia'
import { AlunoService } from 'src/services/alunos'

export const useAlunoStore = defineStore('aluno', {
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
        const novoAluno = await AlunoService.criar(payload)
        this.lista.push(novoAluno)
        return novoAluno
      } catch (erro) {
        console.error(erro)
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
        const alunoAtualizado = await AlunoService.atualizar(id, payload)
        const indice = this.lista.findIndex(a => a.id === id)
        if (indice !== -1) {
          this.lista[indice] = alunoAtualizado
        }
        return alunoAtualizado
      } catch (erro) {
        console.error(erro)
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
        console.error(erro)
        this.erro = erro?.message || 'Erro ao remover aluno'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
