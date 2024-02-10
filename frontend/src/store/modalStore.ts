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

  async function openModal(sentenceText) {
    modalOpen.value = true
    currentSentence.value = sentenceText
    await getExplanationFromAI()
  }

  function closeModal() {
    modalOpen.value = false
    modalLoading.value = false
    modalError.value = null
    modalExplanation.value = ''
  }

  async function getExplanationFromAI() {
    // modalLoading.value = true
    // try {
    //   const response = await axios.post('/api/chatgpt/explain_sentence_ai/', { 
    //     sentence: currentSentence 
    //   })
    //   console.log('res', response.data)

      modalExplanation.value = "Cillum duis est in aliqua pariatur amet duis qui proident commodo fugiat excepteur nulla qui minim in. Ea incididunt cupidatat in culpa ullamco voluptate aliquip sint consequat ad ea irure occaecat officia quis ad cupidatat et commodo ad amet aliquip consequat ut officia enim."
    // } catch (error) {
    //   modalError.value = 'Error fetching explanation'
    // } finally {
    //   modalLoading.value = false
    // }
  }

  return { 
    openModal, closeModal,
    modalOpen, modalLoading, modalError, modalExplanation
  }
})

// openai.error.RateLimitError: You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.
