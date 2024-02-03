import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useModalStore = defineStore('modalStore', () => {

  // State Properties ============================

  const modalOpen = ref(false)
  const modalLoading = ref(false)
  const modalError = ref(null)
  const modalExplanation = ref('')
  const currentSentence = ref('')

  // Actions ============================

  function openModal(sentenceText) {
    modalOpen.value = true
    currentSentence.value = sentenceText
    getExplanationFromAI()
  }

  function closeModal() {
    modalOpen.value = false
    modalLoading.value = false
    modalError.value = null
    modalExplanation.value = ''
  }

  async function getExplanationFromAI() {
    modalLoading.value = true
    // try {
    //   const response = await axios.post('/api/chatgpt/explain_sentence_ai/', { 
    //     sentence: currentSentence 
    //   })
    //   console.log('res', response)

      modalExplanation.value = "Cillum duis est in aliqua pariatur amet duis qui proident commodo fugiat excepteur nulla qui minim in. Ea incididunt cupidatat in culpa ullamco voluptate aliquip sint consequat ad ea irure occaecat officia quis ad cupidatat et commodo ad amet aliquip consequat ut officia enim."
    // } catch (error) {
    //   modalError.value = 'Error fetching explanation'
    // } finally {
      modalLoading.value = false
    // }
  }

  return { 
    openModal, closeModal,
    modalOpen, modalLoading, modalError, modalExplanation
  }
})