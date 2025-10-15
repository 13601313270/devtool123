<template>
  <div class="home">
    <div class="head">
      <h1>&lt;/&gt;&nbsp;&nbsp;开发工具合集</h1>
      <div class="userIcon" v-if="isInitUser && userInfo?.user_metadata.full_name">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" @click="userHover = true" />
        <img v-else src="../assets/user.svg" alt="" @click="userHover = true" />
        <div class="hoverPanelOuter" v-if="userInfo?.user_metadata.full_name">
          <div class="hoverPanel" v-show="userHover">
            <div class="close" @click="userHover = false">
              <img src="@/assets/close.svg" alt="" />
            </div>
            <img v-if="avatarUrl" :src="avatarUrl" alt="" />
            <img v-else src="../assets/user.svg" alt="" />
            <div class="userName">{{ userInfo?.user_metadata.full_name }}</div>
            <div style="flex-grow: 1;"></div>
            <div class="signout" @click="signOut">Sign out</div>
          </div>
        </div>
      </div>
      <div v-else-if="isInitUser" class="loginList">
        <div class="title">Log in</div>
        <div class="loginButton" @click="signIn('google')">
          <img src="../assets/google.svg" alt="">
        </div>
        <div class="loginButton" @click="signIn('github')">
          <img src="../assets/github.svg" alt="">
        </div>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-item create" @click="showCustomToolDialog = true">+&nbsp;定义自己的工具</div>
      <div v-for="value in myCodeList" :key="'myCodeList' + value.id" class="grid-item myCode"
        @click="runCodePreviewIframe(value)">
        <div class="tool-content">
          <h3>{{ value.name }}</h3>
          <p>{{ value.description }}</p>
          <div class="createUser">由用户{{ value.uid }}创建</div>
        </div>
      </div>
      <div class="grid-item" v-for="item in tools" :key="item.id"
        :style="{ gridColumn: 'span ' + item.width, gridRow: 'span ' + item.height }" @click="activeTool = item">
        <div class="tool-content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="dialog" v-if="activeTool">
    <div class="title">
      {{ activeTool.name }}
      <div class="close" @click="activeTool = undefined">
        <img src="@/assets/close.svg" alt="" />
      </div>
    </div>
    <iframe v-if="activeTool.id === 1" src="./tools/json/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 2" src="./tools/md5/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 3" src="./tools/zipImg/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 4" src="./tools/unix/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 5" src="./tools/base64/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 6" src="./tools/getColor/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 7" src="./tools/QRCode/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 8" src="./tools/textDiff/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 9" src="./tools/json2Code/index.html" frameborder="0" />
    <div v-else>{{ activeTool }}</div>
  </div>
  <div class="dialog" v-if="runCodePreview">
    <div class="title">
      {{ runCodePreview.name }}
      <div class="share" @click="copyShareLink">分享</div>
      <div class="close" @click="runCodePreview = undefined">
        <img src="@/assets/close.svg" alt="" />
      </div>
    </div>
    <iframe ref="runCodeDom" class="run-code-preview" frameborder="0" />
  </div>

  <!-- 自定义工具弹窗 -->
  <div class="dialog custom-tool-dialog" v-if="showCustomToolDialog">
    <div class="title">
      自定义工具
      <div class="close" @click="showCustomToolDialog = false">
        <img src="@/assets/close.svg" alt="" />
      </div>
    </div>
    <div class="custom-tool-content">
      <div class="editor-panel">
        <div class="panel-header">
          <h3>HTML代码编辑器</h3>
          <div style="flex-grow: 1;"></div>
          <Button @click="runCode">运行</Button>
        </div>
        <div ref="editorParent" class="codemirror-editor"></div>
      </div>
      <div class="preview-panel">
        <div class="panel-header">
          <h3>预览</h3>
          <div style="flex-grow: 1;"></div>
          <Button @click="saveCode" :loading="saveLoading">保存</Button>
        </div>
        <div class="preview-content" v-html="customHtmlPreview"></div>
      </div>
    </div>
  </div>

  <!-- 保存弹窗 -->
  <div class="dialog save-dialog" v-if="showSaveDialog">
    <div class="title">
      保存工具
      <div class="close" @click="showSaveDialog = false">
        <img src="@/assets/close.svg" alt="" />
      </div>
    </div>
    <div class="save-dialog-content">
      <div class="form-group">
        <label for="toolName">工具名称</label>
        <input id="toolName" v-model="saveName" type="text" placeholder="请输入工具名称" />
      </div>
      <div class="form-group">
        <label for="toolDescription">工具描述</label>
        <textarea id="toolDescription" v-model="saveDescription" placeholder="请输入工具描述"></textarea>
      </div>
      <div class="form-actions">
        <Button @click="showSaveDialog = false">取消</Button>
        <Button @click="doSaveCode" :loading="saveLoading">保存</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef, watch, onBeforeUnmount, nextTick } from 'vue';
import { createClient } from '@supabase/supabase-js';
import Loading from '@/plugins/loading';
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import Toast from '@/plugins/toast';
import Button from '@/components/Button.vue';

const supabase = createClient(
  'https://tizydzbnoppusddwxnay.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpenlkemJub3BwdXNkZHd4bmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTYwMDYsImV4cCI6MjA3NTAzMjAwNn0.HwizQk9VyYK_8VB0zdCTe4R87dj1ALZmZPID90EJGh8'
)

interface Tool {
  id: number;
  name: string;
  description: string;
  width: number;
  height: number;
}
interface myCodeItem {
  id: number;
  name: string;
  description: string;
  uid: number;
}

const isInitUser = ref<boolean>(false)
const userInfo = ref<{
  id: string;
  user_metadata: {
    full_name: string;
  }
}>()
const userHover = ref<boolean>(false)
const activeTool = ref<Tool>()
const avatarUrl = ref<string>()

// 自定义工具弹窗相关
const showCustomToolDialog = ref<boolean>(false)
const showSaveDialog = ref<boolean>(false)
const saveName = ref<string>('')
const saveDescription = ref<string>('')
const customHtmlCode = ref<string>(`<!DOCTYPE html>
<html>
<head>
    <title>我的工具</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        /* 按钮样式 */
        .btn {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          margin: 8px;
        }

        .btn:hover {
          background-color: #3367d6;
        }

        .btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用我的自定义工具</h1>
        <p>在这里编写您的HTML代码，创建您自己的工具。</p>
        <button onclick="alert('Hello, World!')">点击我</button>
    </div>
</body>
</html>`)
const customHtmlPreview = ref<string>('')

// CodeMirror 编辑器相关
const editorView = shallowRef<EditorView | null>(null)
const editorParent = ref<HTMLElement | null>(null)

const tools = ref<Tool[]>([
  { id: 1, name: 'JSON格式化', description: '美化和格式化JSON数据', width: 1, height: 1 },
  { id: 9, name: 'JSON转Code', description: '将JSON数据转换为代码Java/Swift/Kotlin/ Typescript/C#/Python', width: 1, height: 1 },
  { id: 2, name: 'MD5', description: '计算字符串的MD5哈希值', width: 1, height: 1 },
  { id: 3, name: '图片压缩', description: '压缩图片文件大小', width: 1, height: 1 },
  { id: 4, name: 'Unix时间戳转换', description: '转换Unix时间戳为日期', width: 1, height: 1 },
  { id: 5, name: 'Base64编码', description: 'Base64编解码工具', width: 1, height: 1 },
  { id: 6, name: '颜色选择器', description: '颜色值转换和选取', width: 1, height: 1 },
  { id: 7, name: '二维码生成', description: '生成二维码图片', width: 1, height: 1 },
  { id: 8, name: '文本对比', description: '对比两个文本的差异', width: 1, height: 1 },
  // { id: 3, name: '时间转换器', description: '多种时间格式转换', width: 2, height: 1 },
  // { id: 4, name: 'API测试', description: 'HTTP请求测试工具', width: 1, height: 2 },
  // { id: 5, name: '正则表达式', description: '正则表达式测试和验证', width: 1, height: 1 },
  // { id: 8, name: '单位转换', description: '常用单位换算', width: 1, height: 1 },
  // { id: 9, name: '密码生成', description: '安全密码生成器', width: 1, height: 1 },
  // { id: 10, name: 'Markdown编辑器', description: '实时预览Markdown文档', width: 2, height: 1 },
  // { id: 13, name: '文件转换', description: '文件格式转换工具', width: 2, height: 1 },
  // { id: 15, name: 'XML格式化', description: '美化和格式化XML数据', width: 2, height: 1 },
  // { id: 16, name: 'SQL格式化', description: '美化和格式化SQL语句', width: 2, height: 1 },
  // { id: 17, name: 'CSV工具', description: 'CSV文件解析和转换', width: 2, height: 1 },
  // { id: 18, name: 'Markdown预览', description: '实时预览Markdown文档', width: 2, height: 1 },
  // { id: 19, name: '文件下载', description: '文件下载工具', width: 2, height: 1 },
  // { id: 20, name: '文件上传', description: '文件上传工具', width: 2, height: 1 },
  // { id: 21, name: '文件合并', description: '合并多个文件', width: 2, height: 1 },
  // { id: 22, name: '文件拆分', description: '拆分大文件为多个小文件', width: 2, height: 1 },
  // { id: 23, name: '文件加密', description: '文件加密工具', width: 2, height: 1 },
]);

const myCodeList = ref<myCodeItem[]>([])

// 运行代码预览
function runCode() {
  // 从CodeMirror编辑器获取代码
  if (editorView.value) {
    customHtmlCode.value = editorView.value.state.doc.toString();
  }
  customHtmlPreview.value = customHtmlCode.value
}

const saveLoading = ref<boolean>(false)
async function saveCode() {
  // 显示输入弹窗
  showSaveDialog.value = true
}

async function doSaveCode() {
  saveLoading.value = true
  const { data, error } = await supabase.functions.invoke('saveCode', {
    body: {
      name: saveName.value,
      description: saveDescription.value,
      code: customHtmlCode.value,
    }
  })
  if (error) {
    saveLoading.value = false
    console.error('保存代码失败:', error.message);
    return;
  }
  if (data.status === 201) {
    saveLoading.value = false
    Toast.success('代码保存成功')
    console.log('代码保存成功:', data);
    showCustomToolDialog.value = false;
    showSaveDialog.value = false
    saveName.value = ''
    saveDescription.value = ''
    await getMyCodeList();
  }
}

const runCodePreview = ref<myCodeItem>()

const runCodeDom = ref<HTMLIFrameElement | null>(null)
async function runCodePreviewIframe(item: myCodeItem) {
  runCodePreview.value = item
  location.hash = 'codeId=' + item.id.toString()
  runMyCodeItem(item.id)
}
async function runMyCodeItem(id: number) {
  const { data } = await supabase.functions.invoke('getCodeById', {
    body: {
      id,
    }
  })
  runCodePreview.value = data
  console.log(data)
  if (!data || !data.code) {
    return;
  }
  const code = data.code;
  nextTick(() => {
    // 直接把代码写入这个iframe里
    if (runCodeDom.value && runCodeDom.value.contentDocument) {
      runCodeDom.value.contentDocument.open();
      runCodeDom.value.contentDocument.write(code);
      runCodeDom.value.contentDocument.close();
    }
  })
}

// 初始化CodeMirror编辑器
function initCodeMirror() {
  if (editorParent.value && !editorView.value) {
    editorView.value = new EditorView({
      state: EditorState.create({
        doc: customHtmlCode.value,
        extensions: [
          basicSetup,
          html(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              customHtmlCode.value = update.state.doc.toString();
            }
          })
        ]
      }),
      parent: editorParent.value
    });
  }
}

// 销毁CodeMirror编辑器
function destroyCodeMirror() {
  if (editorView.value) {
    editorView.value.destroy();
    editorView.value = null;
  }
}

// 监听弹窗状态变化
watch(showCustomToolDialog, (newVal) => {
  if (newVal) {
    // 弹窗显示时，延迟初始化CodeMirror编辑器
    setTimeout(() => {
      initCodeMirror();
    }, 100);
  } else {
    // 弹窗关闭时销毁编辑器
    destroyCodeMirror();
  }
});

onMounted(async () => {
  initUnitUserInfo();
  // 获取代码列表
  await getMyCodeList();
  // 初始化预览
  runCode();
  if (location.hash.includes('codeId=')) {
    const id = Number(location.hash.replace('#codeId=', ''))
    // location.hash = ''
    if (id) {
      runMyCodeItem(id)
    }
  }
})

// 在组件卸载前销毁编辑器
onBeforeUnmount(() => {
  destroyCodeMirror();
})

async function getMyCodeList() {
  const { data, error } = await supabase.functions.invoke('myCodeList')
  if (error) {
    console.error('获取代码列表失败:', error.message);
    return;
  }
  myCodeList.value = data || []
  console.log('代码列表:', data);
}

async function initUnitUserInfo() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    isInitUser.value = true;
    console.error("用户未登录")
    return
  }

  const fetchUser: any = await fetch(
    "https://tizydzbnoppusddwxnay.supabase.co/functions/v1/userInfo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  if (!fetchUser.ok) {
    throw new Error(`HTTP ${fetchUser.status}`);
  }
  const { user } = await fetchUser.json();
  if (!user) {
    isInitUser.value = true;
    console.log('用户未登录')
    return
  }
  userInfo.value = user as any;
  isInitUser.value = true;
}
async function signIn(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin, // 登录完成后跳转回当前页面
    },
  })
  if (error) {
    console.error('Google 登录失败:', error)
  } else {
    console.log('重定向到 Google 登录页', data)
  }
  Loading({
    message: 'loading...',
  })
}
async function signOut() {
  const loading = Loading({
    message: 'loading...',
  })
  const { error } = await supabase.auth.signOut()
  loading.destory()
  if (error) {
    console.error('退出登录失败:', error)
  } else {
    console.log('退出登录成功')
    // 刷新页面
    window.location.reload();
    isInitUser.value = false;
  }
}
function copyShareLink() {
  const shareLink = window.location.href;
  navigator.clipboard.writeText(shareLink).then(() => {
    Toast.success('分享链接已复制')
  }).catch(() => {
    Toast.error('复制分享链接失败')
  })
}
</script>

<style scoped lang="less">
.home {
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;

  h1 {
    text-align: center;
    margin: 0;
    color: #333;
  }

  .userIcon {
    width: 36px;
    height: 36px;
    border-radius: 24px;
    background-color: #E6E6F1;
    box-shadow: 0 0 1px #a1a1a7;
    position: relative;

    // &:hover {

    //   .hoverPanel {
    //     display: flex !important;
    //   }
    // }

    >img {
      width: 36px;
      height: 36px;
      border-radius: 24px;
      margin-right: 8px;
      cursor: pointer;
    }

    .hoverPanelOuter {
      background-color: transparent;
      position: absolute;
      right: 0;
      top: 26px;
      z-index: 1;

      .hoverPanel {
        margin-top: 26px;
        width: 338px;
        height: 355px;
        border-radius: 24px;
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 241, 1);
        // display: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 17px 0 22px;

        .close {
          position: absolute;
          top: 40px;
          right: 20px;
          font-size: 24px;
          color: rgba(16, 16, 16, 1);
          cursor: pointer;
          z-index: 10001;

          >img {
            width: 25px;
            height: 25px;
          }
        }

        >img {
          width: 48px;
          height: 48px;
          border-radius: 24px;
        }

        .userName {
          margin-top: 10px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .paintedPixels {
          margin-top: 30px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .userLevel {
          margin-top: 18px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .signout {
          width: 201px;
          height: 33px;
          line-height: 20px;
          border-radius: 13px;
          background-color: rgba(255, 255, 255, 1);
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
          text-align: center;
          font-family: PingFangSC-regular;
          border: 1px solid rgba(187, 187, 187, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }

  .loginList {
    display: flex;

    .title {
      margin-right: 8px;
    }

    .loginButton {
      margin-right: 8px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      font-family: PingFangSC-regular;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      >img {
        width: 36px;
        height: 36px;
      }
    }
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(150px, auto);
  gap: 20px;
  margin-top: 20px;
}

.grid-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: solid 1px #e6e6e6;

  &.create {
    // border: solid 1px #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    background-color: #4285f4;
    font-size: 18px;
    color: white;
  }

  &.myCode {
    border: solid 2px #4285f4;
  }

  .grid-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .tool-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    position: relative;

    h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 22px;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .createUser {
      position: absolute;
      color: rgb(140, 140, 140);
      font-size: 14px;
      font-family: PingFangSC-regular;
      background: #4285f4;
      color: white;
      bottom: 0;
      right: 0;
      padding: 3px 8px;
      border-radius: 8px 0 0 0;
    }
  }
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 90%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 9998;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .title {
    flex-shrink: 0;
    height: 48px;
    line-height: 48px;
    color: rgba(3, 61, 93, 1);
    font-size: 24px;
    font-family: PingFangSC-regular;
    text-align: center;

    .share {
      position: absolute;
      top: 8px;
      right: 54px;
      width: 48px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001;
      font-size: 15px;
      color: rgba(3, 61, 93, 1);
      border: solid 1px rgba(3, 61, 93, 1);
      border-radius: 8px;

      >img {
        width: 25px;
        height: 25px;
      }
    }

    .close {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001;

      >img {
        width: 25px;
        height: 25px;
      }
    }
  }

  >iframe {
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
}

// 自定义工具弹窗样式
.custom-tool-dialog {
  .custom-tool-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .editor-panel,
    .preview-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h3 {
          margin: 0;
          color: #333;
        }

        button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          margin-left: 8px;

          &:hover {
            background-color: #3367d6;
          }
        }
      }

      textarea {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        resize: none;
        outline: none;

        &:focus {
          border-color: #4285f4;
        }
      }

      .preview-content {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        overflow: auto;
        background-color: white;
      }
    }

    .editor-panel {
      border-right: 1px solid #eee;

      .codemirror-editor {
        flex: 1;
        overflow: hidden;
        border: 1px solid #ddd;
        border-radius: 4px;

        :deep(.cm-editor) {
          height: 100%;
        }

        :deep(.cm-scroller) {
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
      }
    }
  }
}

// 保存弹窗样式
.save-dialog {
  .save-dialog-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      }

      input,
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;

        &:focus {
          border-color: #4285f4;
          outline: none;
        }
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: auto;
    }
  }
}
</style>
