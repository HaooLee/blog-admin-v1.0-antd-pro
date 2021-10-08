import React, {useState, useEffect, useRef} from 'react'

import {Input, Tooltip, Tag} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

const {CheckableTag} = Tag

// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

//

function TagSelector({value,onChange,newLabel}) {

  const [list, setList] = useState([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedList, setSelectedList] = useState([])
  const preValueRef = useRef(false);

  let inputRef = null

  useEffect(() => {
    // preValueRef.current = [...value]
    // if (value && !value.equals(preValueRef.current)) {
      setList([...new Set([...list,...value])])
      setSelectedList([...value])
    // }
  },[value])








  // useEffect(()=>{
  //   if(){
  //     props.onChange(selectedList)
  //   }
  // },[selectedList])


  function removeItem(item) {
    const newList = list.filter(l => l !== item)
    setList(newList)
  }

  function addItem() {
    if (inputValue && !list.find(d => d === inputValue)) {
      setList([...list, inputValue])
      setSelectedList([...selectedList, inputValue])
      onChange([...selectedList, inputValue])
      setInputValue('')
    }
    setInputVisible(false)
  }

  function showInput() {
    setInputVisible(true)
    inputRef && inputRef.focus()
  }

  // 行点击选中事件
  function handleSelect(value, checked) {
    const newList = checked ? [...selectedList, value] : selectedList.filter(t => t !== value)
    setSelectedList(newList)
    onChange(newList)
  }


  return (
    <>
      {list.map((item, index) => {
        const isLongTag = item.length > 20
        const tagElem = (
          <CheckableTag
            key={index}
            closable="true"
            // onClose={() => removeItem(item)}
            checked={selectedList.includes(item)}
            onChange={checked => handleSelect(item, checked)}
            color='#1890ff'>
            {isLongTag ? `${item.slice(0, 20)}...` : item}
          </CheckableTag>
        )
        return isLongTag ? (
          <Tooltip title={item} key={item}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}

      <Input
        style={{width: 78, display: inputVisible ? 'inline' : 'none'}}
        ref={el => {
          inputRef = el
        }}
        type='text'
        size='small'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={addItem}
        onPressEnter={addItem}
      />

      {!inputVisible && (
        <Tag onClick={showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
          <PlusOutlined/> {newLabel || 'New Tag'}
        </Tag>
      )}
    </>
  )
}

export default TagSelector
