export const checkStrInclude = (str1='', str2='') => {
  if (str1 === str2) return true
  if (!str1) return false
  if (!str2) return true
  return (str1.toLowerCase().includes(str2.toLowerCase()))
}