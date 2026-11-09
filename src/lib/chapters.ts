const CHAPTER_LABELS = ['hello', 'fragments', 'assembled', 'complete']

export function chapterName(index: number) {
  return CHAPTER_LABELS[index] ?? CHAPTER_LABELS[0]
}
