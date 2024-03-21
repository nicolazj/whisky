import { useQuery } from '@tanstack/react-query'

export function useFetchTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: window.api.getTasks
  })
}
export function useFetchWhisperModel() {
  return useQuery({
    queryKey: ['models'],
    queryFn: window.api.getWhisperModels
  })
}

export function useFetchSetting(key: string) {
  return useQuery({
    queryKey: ['setting', key],
    queryFn: () => window.api.getSetting(key),
  })
}
