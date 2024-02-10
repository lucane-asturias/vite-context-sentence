<script lang="ts" setup>
  import { ref } from 'vue'
  import axios, { AxiosResponse } from 'axios'
  import { useModalStore } from '../store/modalStore'
  import { type Result } from '../interface/TatoebaType'

  interface AudioResponse { audio_data: string; }

  const synth = window.speechSynthesis

  const showCheckSVG = ref<boolean>(false)
  const canStopSpeaking = ref<boolean>(false)

  const audioRef = ref<HTMLAudioElement | null>(null)
  const audioMap = new Map<string, HTMLAudioElement>()

  const inSubmission = ref<boolean>(false)
  
  const props = defineProps<{ sentence: Result; }>()

  const modalStore = useModalStore()

  function getTranslation(sentence: string) {
    const firstTranslation: string = sentence.translations[0]?.[0]?.text
    return firstTranslation || ''
  }

  async function speakSentence(audioID) {
    if (!audioID) alert("Sorry, there is no available voice for this text")

    if (inSubmission.value) return

    if (canStopSpeaking.value) {
      audioRef.value.pause() 
      // Reset playback position to the beginning
      audioRef.value.currentTime = 0 
      canStopSpeaking.value = false
      return
    }

    try {
      let audio: HTMLAudioElement | undefined

      if (!audioMap.has(audioID)) {
        inSubmission.value = true
        canStopSpeaking.value = true
        // Fetch audio data if it's not already stored
        const response = await axios.post('/api/download_audio/', { 
          audio_id: audioID 
        }) as AxiosResponse<AudioResponse>

        if (response.data.audio_data) {
          // Decode base64-encoded audio data
          const base64AudioData: string = response.data.audio_data
          const audioBlob: Blob = base64ToBlob(base64AudioData)

          audio = new Audio()
          audio.src = URL.createObjectURL(audioBlob)

          // Store the Audio object associated with audioID
          audioMap.set(audioID, audio)
        } else {
          console.error('No audio data found in response:', response)
          return
        }
      } else {
        audio = audioMap.get(audioID)
      }

      // Reset canStopSpeaking.value when audio playback ends
      audio.onended = () => canStopSpeaking.value = false

      // Play the audio
      audio.play()

      audioRef.value = audio
    } catch (error) {
      console.error('Error fetching audio:', error)
    } finally {
      inSubmission.value = false
    }
  }

  function base64ToBlob(base64Data: string): Blob {
    // Decode the base64-encoded string base64Data into a string of binary data
    const byteCharacters: string = atob(base64Data)
    const byteNumbers: number[] = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: 'audio/mpeg' })
  }

  function copyResponse(sentence: string) {
    if (showCheckSVG.value) return

    const responseToCopy: string = sentence

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
      <template v-if="sentence.audios.length">
        <div 
          @click="speakSentence(sentence.audios[0].id)"
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
            class="w-[19px] h-[19px] text-blue-500 hover:text-blue-200 text-sm cursor-pointer"
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
          </svg>
        </div>
      </template>

      <div @click="copyResponse(sentence.text)" :class="{ 'cursor-pointer': !showCheckSVG }" title="Copy sentence">
        <!-- Copy SVG -->
        <svg 
          v-if="!showCheckSVG" 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5" 
          stroke="currentColor"
          class="w-[18px] h-[18px] text-blue-500 hover:text-blue-200 text-sm cursor-pointer"
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
      <!-- Explain sentence with ChatGPT (not available) -->
      <!-- <button 
        @click="modalStore.openModal(sentence.text)"
        title="Explain Sentence"
        class="text-blue-500 hover:text-blue-200 text-sm bg-transparent border-none outline-none focus:outline-none mt-1">
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