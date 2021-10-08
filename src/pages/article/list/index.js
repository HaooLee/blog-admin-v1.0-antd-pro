import React, {Component, useState, useEffect} from 'react'
import {Tag, Switch, message, Input, Button, Popconfirm, Form} from 'antd'
import { Link, history } from 'umi'
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import {getArticleList, exportArticle} from '@/services/article'

function ArticleList(props) {

  const renderColor = (name, list) => {
    const target = list.find(l => l.name === name)
    return target && target.color
  }

  const toCreateArticle = ()=>{
    history.push('/article/add')
  }

  const columns = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable:true
    },
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      search: false,
      width:150,
      render: (tags, record) => {
        return tags.map(d => (
          <Tag color={renderColor(d.name, record.tags)} key={d.name}>
            {d.name}
          </Tag>
        ))
      }
    },
    {
      title: '分类',
      dataIndex: 'categories',
      width:150,
      search: false,
      render: (categories) => {
        // console.log(categories)
        return categories.map(d => (
          <Tag color='#2db7f5' key={d.name}>
            {d.name}
          </Tag>
        ))
      }
    },
    {
      title: '浏览数',
      dataIndex: 'viewCount',
      search: false
    },
    {
      title: '私密性',
      dataIndex: 'type',
      valueEnum: {
        all: { text: '全部' },
        true: { text: '公开' },
        false: { text: '私密' },
      },
      render: (_,{type}) => {
        return (
          <Tag color={type?'success':'#FF6666'} key={type ? '公开' : '私密'}>
            {type ? '公开' : '私密'}
          </Tag>)
      }
    },
    {
      title: '置顶',
      dataIndex: 'top',
      search: false,
      valueEnum: {
        all: { text: '全部' },
        true: { text: '置顶' },
        false: { text: '公开' },
      },
      render: (_,{top}) => {
        return (
          <Tag color={top?'success':'#D2B4DE'} key={top ? '置顶' : '普通'}>
            {top ? '置顶' : '普通'}
          </Tag>)
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      dataIndex: 'id',
      title: '操作',
      search: false,
      width:120,
      valueType: 'option',
      render: (_, record) => {
        return ([
            <Link key={'edit'} to={{pathname: `/article/edit/${record.id}`}}>编辑</Link>,
            <a key={'export'} onClick={e => exportArticle(record.id)}>导出</a>,
          ]
        /*<Popconfirm title='Are you sure？' cancelText='No' onConfirm={e => updateList(() => axios.delete(`/article/${articleId}`))}>*/
        /*<a className='delete-text'>删除</a>*/
        /*</Popconfirm>*/
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 8,
        }}

        request={async (params) =>{
            // console.log(params)
            const {data:{rows:data},code} = await getArticleList({
              params:{...params,page: params.current}
            })
            return {
              data,
              success: code == 200,
              total:data.count
            }
          }
        }
        toolBarRender={() =>
          (<Button key="button" icon={<PlusOutlined />} type="primary" onClick={toCreateArticle}>
            新建
          </Button>)
          }
      >

      </ProTable>
    </PageContainer>
  )
}

export default ArticleList
