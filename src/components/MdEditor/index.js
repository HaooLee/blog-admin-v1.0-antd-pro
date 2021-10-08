import React from "react";
import Editor, {Plugins} from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {translateMarkdown2html, RandomId} from '@/utils'
import OSS from 'ali-oss'
import styles from './index.less'
import './vs2015.css'


Editor.use(Plugins.TabInsert, {
  /**
   * 用户按下 Tab 键时输入的空格的数目
   * 特别地，1 代表输入一个'\t'，而不是一个空格
   * 默认值是 1
   */
  tabMapValue: 1,
});

const oss = new OSS({
  accessKeyId: 'LTAI5tP2ayCZQeTFWKMdUZAv',
  accessKeySecret: 'etDiGfR7aeA8K5fzDXi0xertxFIHnw',
  bucket: 'haoolee-blog',
  secure: true,
  cname: true,
  endpoint: 'img.haoolee.com',
});

export default function (props) {


  const onImageUpload = async (file) => {
    const res = oss.put(`article/${RandomId(8)}-${file.name}`, file)
    return res.then(res => res.url)
  }


  return (
    <Editor
      {...props}
      style={{minHeight: 600}}
      htmlClass={`${styles['html-wrap']}`}
      onImageUpload={onImageUpload}
      renderHTML={
        text => translateMarkdown2html(text, styles)
      }
      // onChangeTrigger={'beforeRender'}
      onChange={({text})=>props?.triggerChange(text)}

      // onChange={({text}) => console.log(text)}

    />
  )

}
