// src/stores/nota-store.js
import { defineStore } from 'pinia'
import { NotaService } from 'src/services/notas'

export const useNotaStore = defineStore('nota', {
  state: () => ({
    lista: [],        // lista de notas
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarTodas () {
      try {
        this.carregando = true
        this.erro = null
        this.lista = await NotaService.listar()
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao carregar notas'
      } finally {
        this.carregando = false
      }
    },

    async criarNota (payload) {
      try {
        this.carregando = true
        this.erro = null

        // payload esperado:
        // {
        //   aluno_nome: string,
        //   disciplina_nome: string,
        //   nota: number,
        //   data_avaliacao: string (ex: "2024-03-10")
        // }
        const novaNota = await NotaService.criar(payload)
        this.lista.push(novaNota)
        return novaNota
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao criar nota'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async atualizarNota (id, payload) {
      try {
        this.carregando = true
        this.erro = null

        const notaAtualizada = await NotaService.atualizar(id, payload)
        const indice = this.lista.findIndex(n => n.id === id)
        if (indice !== -1) {
          this.lista[indice] = notaAtualizada
        }
        return notaAtualizada
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao atualizar nota'
        throw erro
      } finally {
        this.carregando = false
      }
    },

    async removerNota (id) {
      try {
        this.carregando = true
        this.erro = null

        await NotaService.remover(id)
        this.lista = this.lista.filter(n => n.id !== id)
      } catch (erro) {
        console.error(erro)
        this.erro = erro?.message || 'Erro ao remover nota'
        throw erro
      } finally {
        this.carregando = false
      }
    }
  }
})
