"use client"

import { useCallback, useState } from "react"

import type { NavCollapsibleGroup } from "@/components/nav-collapsible"

function createTeamId() {
  return crypto.randomUUID()
}

export function useNavTeams(initialGroups: NavCollapsibleGroup[]) {
  const [groups, setGroups] = useState(initialGroups)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const addTeam = useCallback((groupTitle: string) => {
    const newTeamId = createTeamId()

    setGroups((current) =>
      current.map((group) => {
        if (group.title !== groupTitle) {
          return group
        }

        return {
          ...group,
          items: [
            ...group.items,
            { id: newTeamId, title: "", url: "#", isDraft: true },
          ],
        }
      })
    )
    setEditingItemId(newTeamId)
  }, [])

  const renameTeam = useCallback(
    (groupTitle: string, itemId: string, title: string) => {
      const trimmedTitle = title.trim()

      setGroups((current) =>
        current.map((group) => {
          if (group.title !== groupTitle) {
            return group
          }

          if (!trimmedTitle) {
            return {
              ...group,
              items: group.items.filter((item) => item.id !== itemId),
            }
          }

          return {
            ...group,
            items: group.items.map((item) =>
              item.id === itemId
                ? { ...item, title: trimmedTitle, isDraft: false }
                : item
            ),
          }
        })
      )
      setEditingItemId(null)
    },
    []
  )

  const cancelEdit = useCallback((groupTitle: string, itemId: string) => {
    setGroups((current) =>
      current.map((group) => {
        if (group.title !== groupTitle) {
          return group
        }

        return {
          ...group,
          items: group.items.filter(
            (item) => item.id !== itemId || !item.isDraft
          ),
        }
      })
    )
    setEditingItemId(null)
  }, [])

  return {
    groups,
    editingItemId,
    addTeam,
    renameTeam,
    cancelEdit,
  }
}
