
/**
 * 限制100
 */
export default (ref: any) => {
  let prevVal = ''
  return (event: any) => {
      console.log(event.target.value)
      const val = event.target.value
      if (!(/^(100|[1-9][0-9]|[0-9]{0,1})$/g.test(val))) {
        ref.current.input.value = prevVal
        return
      }
      prevVal = val
  }
}
