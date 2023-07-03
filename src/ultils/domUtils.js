export const textEllipsis = (line = 2) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  WebkitLineClamp: line,
  WebkitBoxOrient: 'vertical',
  display: '-webkit-box',
  whiteSpace: 'pre-wrap'
})