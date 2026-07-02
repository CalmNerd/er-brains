import { create } from "zustand"

import {
  CLOSED_TASK_MODAL_STATE,
  type OpenTaskModalState,
} from "@/lib/tasks/task-form"
import {
  DEFAULT_TASK_FILTERS,
  type TaskLayout,
  type TaskOrderBy,
  type TaskView,
} from "@/lib/tasks/constants"

type TaskUiState = {
  view: TaskView
  layout: TaskLayout
  orderBy: TaskOrderBy
  modalState: OpenTaskModalState
  setView: (view: TaskView) => void
  setLayout: (layout: TaskLayout) => void
  setOrderBy: (orderBy: TaskOrderBy) => void
  resetFilters: () => void
  setModalState: (modalState: OpenTaskModalState) => void
  closeModal: () => void
  reset: () => void
}

export const useTaskUiStore = create<TaskUiState>((set) => ({
  view: DEFAULT_TASK_FILTERS.view,
  layout: DEFAULT_TASK_FILTERS.layout,
  orderBy: DEFAULT_TASK_FILTERS.orderBy,
  modalState: CLOSED_TASK_MODAL_STATE,
  setView: (view) => set({ view }),
  setLayout: (layout) => set({ layout }),
  setOrderBy: (orderBy) => set({ orderBy }),
  resetFilters: () =>
    set({
      view: DEFAULT_TASK_FILTERS.view,
      layout: DEFAULT_TASK_FILTERS.layout,
      orderBy: DEFAULT_TASK_FILTERS.orderBy,
    }),
  setModalState: (modalState) => set({ modalState }),
  closeModal: () => set({ modalState: CLOSED_TASK_MODAL_STATE }),
  reset: () =>
    set({
      view: DEFAULT_TASK_FILTERS.view,
      layout: DEFAULT_TASK_FILTERS.layout,
      orderBy: DEFAULT_TASK_FILTERS.orderBy,
      modalState: CLOSED_TASK_MODAL_STATE,
    }),
}))
