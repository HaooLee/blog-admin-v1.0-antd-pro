/**
 * @desc 函数防抖
 * @param func 函数
 * @param delay 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func,delay,immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, delay)
      if (callNow) func.apply(context, args)

    }else {
      timeout = setTimeout(function(){
        func.apply(context, args)
      }, delay);
    }
  }
}

export default debounce
