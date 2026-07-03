import { create } from "zustand"

import {
  CLOSED_TASK_MODAL_STATE,
  type OpenTaskModalState,
} from "@/lib/tasks/task-form"
import {
  DEFAULT_TASK_FILTERS,
  type TaskLayout,
  type TaskOrdering,
  type TaskSortBy,
  type TaskView,
} from "@/lib/tasks/constants"

type TaskUiState = {
  view: TaskView
  layout: TaskLayout
  sortBy: TaskSortBy
  ordering: TaskOrdering
  modalState: OpenTaskModalState
  setView: (view: TaskView) => void
  setLayout: (layout: TaskLayout) => void
  setSortBy: (sortBy: TaskSortBy) => void
  setOrdering: (ordering: TaskOrdering) => void
  resetFilters: () => void
  setModalState: (modalState: OpenTaskModalState) => void
  closeModal: () => void
  reset: () => void
}

export const useTaskUiStore = create<TaskUiState>((set) => ({
  view: DEFAULT_TASK_FILTERS.view,
  layout: DEFAULT_TASK_FILTERS.layout,
  sortBy: DEFAULT_TASK_FILTERS.sortBy,
  ordering: DEFAULT_TASK_FILTERS.ordering,
  modalState: CLOSED_TASK_MODAL_STATE,
  setView: (view) => set({ view }),
  setLayout: (layout) => set({ layout }),
  setSortBy: (sortBy) => set({ sortBy }),
  setOrdering: (ordering) => set({ ordering }),
  resetFilters: () =>
    set({
      view: DEFAULT_TASK_FILTERS.view,
      layout: DEFAULT_TASK_FILTERS.layout,
      sortBy: DEFAULT_TASK_FILTERS.sortBy,
      ordering: DEFAULT_TASK_FILTERS.ordering,
    }),
  setModalState: (modalState) => set({ modalState }),
  closeModal: () => set({ modalState: CLOSED_TASK_MODAL_STATE }),
  reset: () =>
    set({
      view: DEFAULT_TASK_FILTERS.view,
      layout: DEFAULT_TASK_FILTERS.layout,
      sortBy: DEFAULT_TASK_FILTERS.sortBy,
      ordering: DEFAULT_TASK_FILTERS.ordering,
      modalState: CLOSED_TASK_MODAL_STATE,
    }),
}))
