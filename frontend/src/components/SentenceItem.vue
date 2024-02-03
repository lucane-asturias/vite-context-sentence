<script lang="ts" setup>
  import { ref } from 'vue'
  import { useModalStore } from '../store/modalStore'
  import { type Result } from '../interface/TatoebaType'

  const synth = window.speechSynthesis

  const showCheckSVG = ref<boolean>(false)
  const canStopSpeaking = ref<boolean>(false)
  
  const props = defineProps<{ sentence: Result; languageCode: string; }>()

  const modalStore = useModalStore()

  function getTranslation(sentence: string) {
    const firstTranslation: string = sentence.translations[0]?.[0]?.text
    return firstTranslation || ''
  }

  function processSentence(sentence: string | Element): string {
    let processedSentence: string

    // Check if the sentence contains HTML tags
    const containsHTML: boolean = /<[^>]+>/g.test(sentence)

    if (!containsHTML) {
      console.log('oi')
      processedSentence = sentence
    } else {
      console.log('ola')
      // Extract text inside <ruby> tags
      processedSentence = cleanHTML(sentence)
    }

    return processedSentence
  }

  function cleanHTML(sentence) {
    // Remove content inside parentheses
    const withoutParentheses = sentence.replace(/（[^）]*）/g, '')
    
    // Remove any remaining HTML tags
    const withoutTags = withoutParentheses.replace(/<[^>]+>/g, '')

    // Trim any leading/trailing whitespace
    return withoutTags.trim()
  }

  function speakSentence(sentence: string | Element) {
    if (canStopSpeaking.value) {
      synth.cancel()
      canStopSpeaking.value = false
      return
    }

    const sentenceToSpeak: string = processSentence(sentence)

    console.log(sentenceToSpeak)

    canStopSpeaking.value = true

    const utterance = new SpeechSynthesisUtterance(sentenceToSpeak)
    console.log('lng_code --> ', props.languageCode)
    utterance.lang = props.languageCode // defaults to German
  
    utterance.onend = () => canStopSpeaking.value = false

    synth.speak(utterance)
  }

  function copyResponse(sentence: string) {
    if (showCheckSVG.value) return

    const responseToCopy: string = processSentence(sentence)

    showCheckSVG.value = true

    navigator.clipboard.writeText(responseToCopy)
      .then(() => console.log('Text copied to clipboard:', responseToCopy))
      .catch((error) => console.error('Unable to copy text to clipboard', error))

    setTimeout(() => showCheckSVG.value = false, 3000)
  }

  function generateTatoebaUrl(sentence) {
    return `https://tatoeba.org/en/sentences/search?query=${encodeURIComponent(sentence)}`
  }
</script>

<template>
  <div class="text-lg font-medium">
    <span v-if="sentence.lang_tag === 'ja'" v-html="sentence.transcriptions[0].html"></span>
    <span v-else>{{ sentence.text }}</span>

    <small class="inline-flex items-center point ml-2 space-x-2">
      <div 
        @click="sentence.lang_tag === 'ja' 
          ? speakSentence(sentence.transcriptions[0].html) 
          : speakSentence(sentence.text)"
        :title="canStopSpeaking ? 'Stop Sentence' : 'Read Sentence'"
      >
        <!-- Speak SVG -->
        <svg 
          v-if="!canStopSpeaking"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-[20px] h-[20px] text-blue-500 hover:text-blue-200 text-sm cursor-pointer"
        >
          <path 
            stroke-linecap="round"
            stroke-linejoin="round"
            d="
              M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0
              7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0
              1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1
              2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
        </svg>
        <!-- Stop SVG -->
        <svg 
          v-else 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-[19px] h-[19px] ml-1 text-blue-100 hover:text-blue-200 text-sm cursor-pointer"
        >
          <!-- why two paths -->
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
        </svg>
      </div>

      <div @click="copyResponse(sentence.text)" :class="{ 'cursor-pointer': !showCheckSVG }" title="Copy sentence">
        <!-- Copy SVG -->
        <svg 
          v-if="!showCheckSVG" 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5" 
          stroke="currentColor"
          class="w-[19px] h-[19px] text-blue-500 hover:text-blue-200 text-sm cursor-pointer"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="
              M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166
              1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75
              0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11
              1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25
              2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057
              1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
        <!-- Check SVG -->
        <svg
          v-else 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="w-4 h-4 hover:text-gray-400"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M4.5 12.75l6 6 9-13.5" 
          />
        </svg>
      </div>
      <!-- Explain sentence with ChatGPT -->
      <!-- <button 
        @click="modalStore.openModal(sentence.text)"
        title="Explain Sentence"
        class="text-blue-500 hover:text-blue-200 text-sm bg-transparent border-none outline-none focus:outline-none">
        Details
      </button> -->
    </small>
  </div>

  <div class="text-gray-500 mt-2">
    {{ getTranslation(sentence) }}
    <small class="text-blue-500 hover:text-blue-200">
      <a 
        target="_blank" 
        rel="noreferrer" 
        :href="generateTatoebaUrl(sentence.text)"
        title="Open on Tatoeba">
        
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor" 
          class="w-[16px] h-[16px] ml-1 inline-block ml-1"
        >
          <path 
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
      </a>
    </small>
  </div>
</template>

<style scoped>
  rt, rp {
    user-select: none;
  }
</style>