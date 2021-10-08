import React, {useRef, useState, useEffect} from 'react'
import {message, Modal} from 'antd'
import { useModel} from 'umi';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import {
  getArticle,
  addArticle,
  updateArticle
} from '@/services/article'
import ProForm, {
  ProFormText,
  ProFormSwitch
} from '@ant-design/pro-form';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card'
import TagSelector from '@/components/TagSelector'
import MdEditor from '@/components/MdEditor'
import debounce from '@/utils/debounce'
import { set, get, remove } from '@/utils/storage'


function ArticleList(props) {
  const formRef = useRef();
  const editId = props.match.params.id
  const cacheKey = editId ? `edit-cache-${editId}`:`create-cache`
  const {initialState} = useModel('@@initialState');

  // console.log(initialState)
  useEffect(() => {
    if (editId) { // 编辑模式去请求文章详情
      getArticle(editId).then(({data, code}) => {
        if (code == 200) {
          formRef.current.setFieldsValue({
            title: data.title,
            desc: data.desc,
            top: data.top,
            type: data.type,
            content: data.content,
            tags: data.tags.map(d => d.name),
            categories: data.categories.map(d => d.name),
          })
        }
      })
    }
  }, [])

  useEffect(()=>{
    // 读取本地缓存
    const localCache = get(cacheKey)
    if(localCache){
      Modal.confirm({
        title: '检测到有未保存的改变,是否载入上次修改',
        icon: <ExclamationCircleOutlined />,
        // content: 'Some descriptions',
        onOk() {
          formRef.current.setFieldsValue(localCache)
          message.success('已载入上次修改缓存')
        },
        onCancel() {
          remove(cacheKey)
          message.success('已清除上次修改缓存')
        },
      });
    }

  },[])

  const onAddArticle = values=> addArticle({...values,authorId:initialState.currentUser.id})
  const onUpdArticle = values=> updateArticle(editId,{...values,authorId:initialState.currentUser.id})


  const onFinish = (values) => {
    // console.log(values)
    // 编辑模式
    if(editId !== undefined){
      onUpdArticle(values).then(({code})=>{
        if(code == 200){
          message.success('修改成功')
          remove(cacheKey)
        }
      })
    }else {
      onAddArticle(values).then(({code})=>{
        if(code == 200){
          message.success('新建文章成功')
          remove(cacheKey)
        }
      })
    }
  }

  const editCache = (values)=>{
    set(cacheKey,values)
  }

  const formChange = debounce((values)=>{
    editCache(values)
  },500)

  const formItemLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 14},
  }


  return (
    <PageContainer>
      <ProCard>
        <ProForm
          {...formItemLayout}
          layout={'horizontal'}
          // layout={'vertical'}
          onFinish={onFinish}
          formRef={formRef}
          onValuesChange={(_,changeValues) => formChange(changeValues)}
          submitter={{
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: 'none',
              },
            },
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}

        >
          <ProFormText
            // width="md"
            name="title"
            label="文章标题"
            tooltip="最长为255位"
            placeholder="请输入文章标题"
            rules={[
              {
                required: true,
                message: '标题不能为空!',
              },
            ]}
          >
          </ProFormText>
          <ProFormText
            // width="md"
            name="desc"
            label="文章描述"
            tooltip="最长为255位"
            placeholder="请输入文章描述"
          >
          </ProFormText>
          <ProFormSwitch width="xl" name="top" label="是否置顶" checkedChildren="置顶" unCheckedChildren="普通"/>
          <ProFormSwitch width="xl" name="type" label="是否公开" checkedChildren="公开"
                         unCheckedChildren="隐藏"/>

          <ProForm.Item
            label="文章标签"
            name="tags"
            initialValue={[]}

          >
            <TagSelector newLabel={'新建标签'}/>
          </ProForm.Item>
          <ProForm.Item
            label="文章分类"
            name="categories"
            initialValue={[]}

          >
            <TagSelector newLabel={'新建分类'}/>
          </ProForm.Item>
          <ProForm.Item
            label="文章内容"
            name="content"
            trigger="triggerChange"
            noStyle
          >
            <MdEditor style={{minHeight: 600}}/>
          </ProForm.Item>


        </ProForm>
      </ProCard>


    </PageContainer>
  )
}

export default ArticleList
