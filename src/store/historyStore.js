import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const history = ref([])
  const currentIndex = ref(-1)
  const maxHistory = 50

  // Можем ли отменить/повторить
  const canUndo = () => currentIndex.value > 0
  const canRedo = () => currentIndex.value < history.value.length - 1

  // Добавить состояние в историю
  const pushState = (state) => {
    // Удаляем всё после текущего индекса (при новом действии после отмены)
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    history.value.push(JSON.parse(JSON.stringify(state)))

    // Ограничиваем размер истории
    if (history.value.length > maxHistory) {
      history.value.shift()
    } else {
      currentIndex.value++
    }
  }

  // Отменить
  const undo = () => {
    if (!canUndo()) return null
    currentIndex.value--
    return JSON.parse(JSON.stringify(history.value[currentIndex.value]))
  }

  // Повторить
  const redo = () => {
    if (!canRedo()) return null
    currentIndex.value++
    return JSON.parse(JSON.stringify(history.value[currentIndex.value]))
  }

  // Инициализировать начальным состоянием
  const init = (initialState) => {
    history.value = [JSON.parse(JSON.stringify(initialState))]
    currentIndex.value = 0
  }

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    init
  }
})
